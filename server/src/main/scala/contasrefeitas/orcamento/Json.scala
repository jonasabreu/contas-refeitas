package contasrefeitas.orcamento

import br.com.caelum.vraptor.view.Results.nothing
import br.com.caelum.vraptor.{ View, Result }
import javax.servlet.http.{ HttpServletResponse, HttpServletRequest }
import sjson.json.Serializer.{ SJSON => serializer }
import br.com.caelum.vraptor.ioc.Component

@Component
class Json(res : HttpServletResponse, result : Result) extends View {

  def render(obj : Seq[(String, Double)]) : Unit = {
    res.setContentType("application/json")
    res.getOutputStream.write(serializer.out(obj))
    result.use(nothing)
  }

}