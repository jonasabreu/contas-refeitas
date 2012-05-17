package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import scala.xml.XML

@Component
@ApplicationScoped
class Orcamento {

  val original = XML.load(classOf[Orcamento].getResourceAsStream("/cmsp/gastos-2011.xml"))

}
