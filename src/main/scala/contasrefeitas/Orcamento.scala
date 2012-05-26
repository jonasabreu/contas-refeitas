package contasrefeitas

import br.com.caelum.vraptor.ioc.ApplicationScoped
import br.com.caelum.vraptor.ioc.Component
import java.text.NumberFormat
import java.util.Locale
import scala.Option.option2Iterable
import scala.collection.mutable.ListBuffer
import scala.reflect.BeanInfo
import scala.xml.NodeSeq.seqToNodeSeq
import scala.xml.NodeSeq
import scala.xml.XML
import java.text.DecimalFormat

case class Gasto(subfuncao : String, natureza : String, destino : String, valor : Double)

@BeanInfo
case class Child(label : String, value : Double, formattedValue : String, childs : List[Child], rootPercent : String, percent : String, maxChilds : Int)

object Child {

  implicit def addAsBrl(value : Double) = new {
    def asBrl = NumberFormat.getCurrencyInstance(new Locale("pt", "BR")).format(value)
    def percentOf(reference : Double) = "%1.2f".format(value * 100 / reference) + "%"
  }

  def apply(label : String, value : Double, childs : List[Child], root : Double, total : Double, maxChilds : Int) : Child = {
    Child(label, value, value.asBrl, childs, value.percentOf(root), value.percentOf(total), maxChilds)
  }
}

@Component
@ApplicationScoped
class Orcamento {

  val gastos = parse(XML.load(classOf[Orcamento].getResourceAsStream("/cmsp/gastos-2011.xml")) \\ "ficha")

  implicit def addSoma(list : List[Gasto]) = new {
    def soma = list.foldLeft(0.0)(_ + _.valor)
  }

  implicit def addOrDefault(value : Int) = new {
    def orDefault(default : Int) = if (value == 0) default else value
  }

  val total = gastos.soma

  def join(list : List[(Gasto) => String], limit : Int, startAt : Int) : Child = {
    val (innerChilds, maxChilds) = join(gastos, list, limit.orDefault(10), startAt.orDefault(0), total, total)
    Child("Total gasto", total, innerChilds, total, total, maxChilds)
  }

  private def join(gastos : List[Gasto], filters : List[(Gasto) => String], limit : Int, startAt : Int, root : Double, total : Double) : (List[Child], Int) = {
    if (!filters.isEmpty) {
      val items = gastos.map(filters.head).distinct
      val aux = items.map(item => {
        val filteredItems = gastos.filter(elem => filters.head(elem) == item)
        val soma = filteredItems.soma
        val (innerItems, maxChilds) = join(filteredItems, filters.tail, limit, startAt, soma, total)
        Child(item, soma, innerItems, root, total, maxChilds)
      }).sortWith((a, b) => a.value > b.value)
      (if (!(filters.length == 1)) aux else aux.slice(startAt, startAt + limit), aux.length)
    } else {
      (List(), 0)
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
          if (valor > Double.MinPositiveValue) {
            buffer += Gasto(subfuncao, natureza, destino, valor)
          }
        })
      })
    })
    buffer.toList
  }
}

