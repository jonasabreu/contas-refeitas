package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import br.com.caelum.vraptor.{ Resource, Get }
import scala.xml.Text
import scala.xml.Text
import br.com.caelum.vraptor.Result
import br.com.caelum.vraptor.view.Results
import br.com.caelum.vraptor.Path

@Resource
class Controller(orcamento : Orcamento, result : Result) {

  @Get(Array("/{dado}"))
  def dados(dado : String) = {
    result.use(classOf[Json]).render(orcamento.joinUnder(dado match {
      case "subfuncao" => _.subfuncao
      case "natureza" => _.natureza
      case "destino" => _.destino
    }))
  }

  @Get(Array("/subfuncao/natureza"))
  def subfuncao(dado : String) = {
    result.use(classOf[Json]).render(orcamento.join(_.subfuncao, _.natureza))
  }

  @Get
  @Path(value = (Array("/favicon.ico")), priority = 1)
  def ignoreFavicon = {}
}

