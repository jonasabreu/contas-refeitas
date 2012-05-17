package contasrefeitas.orcamento;

import br.com.caelum.vraptor.ioc.{ Component, ApplicationScoped }
import scala.xml.XML
import scala.xml.Elem
import scala.xml.NodeSeq
import scala.collection.mutable.ListBuffer

@Component
@ApplicationScoped
class Orcamento {

  val original = XML.load(classOf[Orcamento].getResourceAsStream("/cmsp/gastos-2011.xml"))

  val gastos = parse(original \\ "ficha")

  def parse(nodes : NodeSeq) : List[Gasto] = {
    val buffer = ListBuffer[Gasto]()
    nodes.foreach(node => {
      val subfuncao = (node \ "subFuncao").headOption.getOrElse(null).text
      val natureza = (node \ "natureza").headOption.getOrElse(null).text
      (node \\ "fornecedor").foreach(node => {
        val fornecedor = (node.attribute("nome")).head.text
        (node \\ "vlrPago").foreach(node => {
          val valor = node.text.replaceAll(",", ".").toDouble
          val gasto = Gasto(subfuncao, natureza, fornecedor, valor)
          buffer += gasto
        })
      })
    })
    buffer.toList
  }

  def joinUnderNatureza : Seq[(String, Double)] = {
    null
  }

  def joinUnderSubFuncao : Seq[(String, Double)] = {

  }
}

case class Gasto(subfuncao : String, natureza : String, fornecedor : String, valor : Double)

object Runner {
  def main(args : Array[String]) {
    print(new Orcamento().gastos.size)
  }
}
