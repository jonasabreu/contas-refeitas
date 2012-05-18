package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import scala.xml.XML
import scala.xml.Elem
import scala.xml.NodeSeq
import scala.collection.mutable.ListBuffer

case class Gasto(subfuncao : String, natureza : String, destino : String, valor : Double)

@Component
@ApplicationScoped
class Orcamento {

  private val max = 10

  val gastos = parse(XML.load(classOf[Orcamento].getResourceAsStream("/cmsp/gastos-2011.xml")) \\ "ficha")

  implicit def addSoma(list : List[Gasto]) = new {
    def soma = list.foldLeft(0.0)(_ + _.valor)
  }

  def join(list : List[(Gasto) => String]) : AnyRef = join(gastos, list)

  private def join(gastos : List[Gasto], filters : List[(Gasto) => String]) : List[_] = {
    if (!filters.isEmpty) {
      val items = gastos.map(filters.head).distinct
      items.map(item => {
        val filteredItems = gastos.filter(elem => filters.head(elem) == item)
        val innerItems = join(filteredItems, filters.tail)
        innerItems match {
          case List() => List(item, filteredItems.soma)
          case _ => List(item, List(filteredItems.soma, innerItems))
        }
      }).sortWith((a, b) => num(a) > num(b))
    } else {
      List()
    }
  }

  private def num(item : List[Any]) : Double = {
    item(1) match {
      case n : Double => n
      case n : List[_] => n(0).asInstanceOf[Double]
    }
  }

  private def parse(nodes : NodeSeq) : List[Gasto] = {
    val buffer = ListBuffer[Gasto]()
    nodes.foreach(node => {
      val subfuncao = (node \ "subFuncao").headOption.getOrElse(null).text
      val natureza = (node \ "natureza").headOption.getOrElse(null).text
      (node \\ "fornecedor").foreach(node => {
        val destino = (node.attribute("nome")).head.text
        (node \\ "vlrPago").foreach(node => {
          val valor = node.text.replaceAll(",", ".").toDouble
          val gasto = Gasto(subfuncao, natureza, destino, valor)
          buffer += gasto
        })
      })
    })
    buffer.toList
  }

}
