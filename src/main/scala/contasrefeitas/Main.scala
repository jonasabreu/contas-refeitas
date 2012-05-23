package contasrefeitas

import br.com.caelum.vraptor.ioc.ApplicationScoped
import br.com.caelum.vraptor.ioc.Component
import br.com.caelum.vraptor.Get
import br.com.caelum.vraptor.Path
import br.com.caelum.vraptor.Resource
import br.com.caelum.vraptor.Result

@Resource
class Main(orcamento : Orcamento, result : Result) {

  @Get(Array("/"))
  def index() = {
  }

  @Get(Array("/filtros/{filtro}"))
  def filtroSimples(filtro : String, limit : Int) = {
    render(List(filterFor(filtro)), limit)
  }

  @Get(Array("/filtros/{filtro1}/{filtro2}"))
  def filtroDuplo(filtro1 : String, filtro2 : String, limit : Int) = {
    render(List(filterFor(filtro1), filterFor(filtro2)), limit)
  }

  @Get(Array("/filtros/{filtro1}/{filtro2}/{filtro3}"))
  def filtroTriplo(filtro1 : String, filtro2 : String, filtro3 : String, limit : Int) = {
    render(List(filterFor(filtro1), filterFor(filtro2), filterFor(filtro3)), limit)
  }

  @Get
  @Path(value = (Array("/favicon.ico")), priority = 1)
  def ignoreFavicon = {}

  private def render(filters : List[(Gasto) => String], limit : Int) = {
    result.use(classOf[Json]).render(orcamento.join(filters, limit))
  }

  private def filterFor(filtro : String) : (Gasto) => String = filtro match {
    case "subfuncao" => _.subfuncao
    case "natureza" => _.natureza
    case "destino" => _.destino
  }
}

