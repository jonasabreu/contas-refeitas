package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import scala.xml.XML
import scala.xml.Elem
import scala.xml.NodeSeq
import scala.collection.mutable.ListBuffer
import scala.reflect.BeanInfo

case class Gasto(subfuncao : String, natureza : String, destino : String, valor : Double)

@BeanInfo
case class Child(label : String, value : Double, childs : List[Child])

@Component
@ApplicationScoped
class Orcamento {

  private val default = 10

  val gastos = parse(XML.load(classOf[Orcamento].getResourceAsStream("/cmsp/gastos-2011.xml")) \\ "ficha")

  implicit def addSoma(list : List[Gasto]) = new {
    def soma = list.foldLeft(0.0)(_ + _.valor)
  }

  def total = gastos.soma

  def join(list : List[(Gasto) => String], limit : Int) : Child = Child("root", gastos.soma, join(gastos, list, if (limit == 0) default else limit))

  private def join(gastos : List[Gasto], filters : List[(Gasto) => String], limit : Int) : List[Child] = {
    if (!filters.isEmpty) {
      val items = gastos.map(filters.head).distinct
      val (maiores, outros) = items.map(item => {
        val filteredItems = gastos.filter(elem => filters.head(elem) == item)
        val innerItems = join(filteredItems, filters.tail, limit)

        Child(item, filteredItems.soma, innerItems)
      }).sortWith((a, b) => a.value > b.value).splitAt(limit)

      if (outros.isEmpty)
        maiores
      else
        maiores ++ List(Child("Outros", outros.foldLeft(0.0)((a, b) => a + b.value), List()))

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
      val subfuncao = (node \ "subFuncao").head.text
      val natureza = (node \ "natureza").head.text
      (node \\ "fornecedor").foreach(node => {
        val destino = (node.attribute("nome")).head.text
        (node \\ "vlrPago").foreach(node => {
          val valor = node.text.replaceAll(",", ".").toDouble
          buffer += Gasto(subfuncao, natureza, destino, valor)
        })
      })
    })
    buffer.toList
  }
}

