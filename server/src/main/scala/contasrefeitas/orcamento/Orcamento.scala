package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import scala.xml.XML

@Component
@ApplicationScoped
class Orcamento {

  val original = XML.load(classOf[Orcamento].getResourceAsStream("/cmsp/gastos-2011.xml"))

  def joinUnder(category : String) : Seq[(String, Double)] = {
    val items = (original \\ category).map(_.text).distinct

    items.map(sf => {
      val fichas = (original \\ "ficha" filter (ficha => (ficha \\ category).map(_.text).headOption == Some(sf)))

      (sf, (fichas \\ "vlrPago").foldLeft(0.0)(_ + _.text.replaceAll(",", ".").toDouble))
    })
  }

}