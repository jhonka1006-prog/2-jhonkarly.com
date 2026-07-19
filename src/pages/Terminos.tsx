import LegalPage from "@/components/LegalPage";
import { usePageMeta } from "@/lib/seo";

const Terminos = () => {
  usePageMeta({
    titulo: "Términos y Condiciones — Jhonkarly Alvarez",
    descripcion:
      "Condiciones de uso de jhonkarly.com: propiedad intelectual, cuentas, compras en la tienda oficial y uso del kit de prensa.",
    ruta: "/terminos",
  });

  return (
  <LegalPage
    etiqueta="Legal"
    titulo={<>Términos y<br /><span className="text-g300">condiciones</span></>}
    actualizado="15 de julio de 2026"
    intro="Estos términos regulan el uso de jhonkarly.com, el sitio oficial del atleta paralímpico colombiano Jhonkarly Alvarez Pantoja. Al navegar por el sitio, crear una cuenta o realizar una compra, aceptas estas condiciones."
    secciones={[
      {
        titulo: "Sobre este sitio",
        contenido: (
          <p>
            jhonkarly.com es el sitio personal y oficial de{" "}
            <strong>Jhonkarly Alvarez Pantoja</strong>. Su propósito es dar a conocer su historia
            y trayectoria deportiva, centralizar su relación con medios de comunicación, ofrecer
            merchandising oficial y contenido para seguidores.
          </p>
        ),
      },
      {
        titulo: "Propiedad intelectual",
        contenido: (
          <>
            <p>
              Todos los contenidos del sitio — textos, fotografías, videos, logotipos, la marca
              "Jhonkarly Alvarez" y el diseño — son propiedad de Jhonkarly Alvarez Pantoja o se
              usan con autorización de sus titulares. <strong>No está permitida su reproducción,
              distribución o uso comercial sin autorización previa y por escrito.</strong>
            </p>
            <p>
              Excepción: el material del <strong>kit de prensa</strong> puede ser utilizado por
              medios de comunicación acreditados, exclusivamente con fines informativos y citando
              la fuente.
            </p>
          </>
        ),
      },
      {
        titulo: "Cuentas de usuario",
        contenido: (
          <ul>
            <li>Las cuentas del área privada (prensa, contenido exclusivo, administración) son personales e intransferibles.</li>
            <li>Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad realizada con tu cuenta.</li>
            <li>Podemos suspender o eliminar cuentas que incumplan estos términos o hagan un uso indebido del sitio.</li>
          </ul>
        ),
      },
      {
        titulo: "Tienda oficial",
        contenido: (
          <>
            <ul>
              <li>Los precios se expresan en <strong>pesos colombianos (COP)</strong> e incluyen los impuestos aplicables, salvo indicación en contrario.</li>
              <li>Los pagos se procesan a través de pasarelas externas seguras; no almacenamos datos de tarjetas ni medios de pago.</li>
              <li>La disponibilidad de los productos está sujeta a existencias. Los productos marcados como "agotado" no pueden adquirirse.</li>
              <li>Los plazos, costos de envío y política de cambios se informan durante el proceso de compra o por correo antes de confirmar el pedido.</li>
            </ul>
            <p>
              Para cualquier gestión sobre un pedido escribe a{" "}
              <a href="mailto:contact@jhonkarly.com">contact@jhonkarly.com</a>.
            </p>
          </>
        ),
      },
      {
        titulo: "Uso permitido del sitio",
        contenido: (
          <>
            <p>Al usar el sitio te comprometes a no:</p>
            <ul>
              <li>Intentar acceder sin autorización a áreas privadas, cuentas de terceros o a la infraestructura del sitio.</li>
              <li>Extraer contenidos de forma masiva o automatizada (scraping) con fines comerciales.</li>
              <li>Usar el sitio para actividades ilícitas, difamatorias o que dañen la imagen del atleta o de terceros.</li>
            </ul>
          </>
        ),
      },
      {
        titulo: "Enlaces a terceros",
        contenido: (
          <p>
            El sitio enlaza a plataformas de terceros (YouTube, Instagram, TikTok, pasarelas de
            pago, entre otras). No controlamos esos servicios ni respondemos por sus contenidos,
            políticas o disponibilidad. Su uso se rige por los términos de cada plataforma.
          </p>
        ),
      },
      {
        titulo: "Limitación de responsabilidad",
        contenido: (
          <p>
            Trabajamos para que la información del sitio sea correcta y el servicio estable, pero
            el sitio se ofrece "tal cual". En la medida permitida por la ley, no respondemos por
            daños derivados de interrupciones del servicio, errores tipográficos o del uso que
            terceros hagan de la información publicada.
          </p>
        ),
      },
      {
        titulo: "Privacidad",
        contenido: (
          <p>
            El tratamiento de tus datos personales se rige por nuestra{" "}
            <a href="/privacidad">Política de Privacidad</a>, que forma parte integral de estos
            términos.
          </p>
        ),
      },
      {
        titulo: "Ley aplicable",
        contenido: (
          <p>
            Estos términos se rigen por las leyes de la <strong>República de Colombia</strong>.
            Cualquier controversia se someterá a los jueces y tribunales competentes de Colombia,
            sin perjuicio de las normas de protección al consumidor que resulten aplicables.
          </p>
        ),
      },
      {
        titulo: "Cambios a estos términos",
        contenido: (
          <p>
            Podemos modificar estos términos cuando sea necesario. Los cambios rigen desde su
            publicación en esta página, con la fecha de actualización indicada al inicio.
          </p>
        ),
      },
    ]}
  />
  );
};

export default Terminos;
