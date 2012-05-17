package contasrefeitas.orcamento

import br.com.caelum.vraptor.view.Results.nothing
import br.com.caelum.vraptor.{ View, Result }
import javax.servlet.http.{ HttpServletResponse, HttpServletRequest }
import sjson.json.Serializer.{ SJSON => serializer }
import br.com.caelum.vraptor.ioc.Component

@Component
class Json(req : HttpServletRequest, res : HttpServletResponse, result : Result) extends View {

  def render(name : String) : Unit = {
    val obj = req.getAttribute(name)
    res.setContentType("application/json")
    res.getOutputStream.write(serializer.out(obj))
    result.use(nothing)
  }

}