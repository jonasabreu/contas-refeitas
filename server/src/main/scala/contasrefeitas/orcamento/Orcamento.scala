package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import scala.xml.XML
import scala.xml.Elem
import scala.xml.NodeSeq
import scala.collection.mutable.ListBuffer

@Component
@ApplicationScoped
class Orcamento {

  val gastos = parse(XML.load(classOf[Orcamento].getResourceAsStream("/cmsp/gastos-2011.xml")) \\ "ficha")

  def parse(nodes : NodeSeq) : List[Gasto] = {
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

  def joinUnder(f : (Gasto) => String) : Seq[(String, Double)] = {
    val items = gastos.map(f).distinct
    items.map(item => {
      (item, gastos.filter(elem => f(elem) == item).foldLeft(0.0)(_ + _.valor))
    }).sortWith((a, b) => a._2 > b._2)
  }
}

case class Gasto(subfuncao : String, natureza : String, destino : String, valor : Double)
