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
    result.use(classOf[Json]).render(orcamento.joinUnder("subFuncao"))
  }

  @Get(Array("/natureza"))
  def natureza() = {
    result.use(classOf[Json]).render(orcamento.joinUnder("natureza"))
  }

}

