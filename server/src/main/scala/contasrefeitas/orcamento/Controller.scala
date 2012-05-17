package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import br.com.caelum.vraptor.{ Resource, Get }
import scala.xml.Text
import scala.xml.Text
import br.com.caelum.vraptor.Result
import br.com.caelum.vraptor.view.Results

@Resource
class Controller(orcamento : Orcamento, result : Result) {

  @Get(Array("/subfuncao"))
  def subfuncao() = {
    val subfuncoes = (orcamento.original \\ "subFuncao").map(_.text).distinct

    val agrupamento = subfuncoes.map(sf => {
      val total = 0

      val fichas = (orcamento.original \\ "ficha" filter (ficha => (ficha \ "subFuncao").map(_.text).head == sf))

      (sf, (fichas \\ "vlrPago").foldLeft(0.0)(_ + _.text.replaceAll(",", ".").toDouble))
    })

    result.include("agrupamento", agrupamento)
    result.use(classOf[Json]).render("agrupamento")
  }
}

object Runner {
  def main(args : Array[String]) {
    print(new Controller(new Orcamento, null).subfuncao)
  }
}
