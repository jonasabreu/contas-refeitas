package contasrefeitas

import br.com.caelum.vraptor.ioc.Component
import br.com.caelum.vraptor.view.Results.nothing
import br.com.caelum.vraptor.Result
import br.com.caelum.vraptor.View
import javax.servlet.http.HttpServletResponse
import sjson.json.Serializer.{ SJSON => serializer }

@Component
class Json(res : HttpServletResponse, result : Result) extends View {

  def render(obj : AnyRef) : Unit = {
    res.setContentType("application/json")
    res.getOutputStream.write(serializer.out(obj))
    result.use(nothing)
  }

}