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

  @Get(Array("/{filtro}"))
  def filtroSimples(filtro : String) = {
    render(List(filterFor(filtro)))
  }

  @Get(Array("/{filtro1}/{filtro2}"))
  def filtroDuplo(filtro1 : String, filtro2 : String) = {
    render(List(filterFor(filtro1), filterFor(filtro2)))
  }

  @Get(Array("/{filtro1}/{filtro2}/{filtro3}"))
  def filtroTriplo(filtro1 : String, filtro2 : String, filtro3 : String) = {
    render(List(filterFor(filtro1), filterFor(filtro2), filterFor(filtro3)))
  }

  @Get
  @Path(value = (Array("/favicon.ico")), priority = 1)
  def ignoreFavicon = {}

  private def render(filters : List[(Gasto) => String]) = {
    result.use(classOf[Json]).render(orcamento.join(filters))
  }

  private def filterFor(filtro : String) : (Gasto) => String = filtro match {
    case "subfuncao" => _.subfuncao
    case "natureza" => _.natureza
    case "destino" => _.destino
  }
}

