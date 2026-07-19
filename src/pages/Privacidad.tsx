import LegalPage from "@/components/LegalPage";
import { usePageMeta } from "@/lib/seo";

const Privacidad = () => {
  usePageMeta({
    titulo: "Política de Privacidad — Jhonkarly Alvarez",
    descripcion:
      "Cómo se recopilan, usan y protegen los datos personales en jhonkarly.com, conforme a la Ley 1581 de 2012 de Colombia.",
    ruta: "/privacidad",
  });

  return (
  <LegalPage
    etiqueta="Legal"
    titulo={<>Política de<br /><span className="text-g300">privacidad</span></>}
    actualizado="15 de julio de 2026"
    intro="En jhonkarly.com respetamos tu privacidad. Esta política explica qué datos personales recopilamos, para qué los usamos y qué derechos tienes sobre ellos, conforme a la Ley 1581 de 2012 de Colombia (protección de datos personales) y sus normas complementarias."
    secciones={[
      {
        titulo: "Responsable del tratamiento",
        contenido: (
          <p>
            El responsable del tratamiento de los datos personales recogidos en este sitio es{" "}
            <strong>Jhonkarly Alvarez Pantoja</strong> (Colombia). Para cualquier asunto
            relacionado con tus datos puedes escribir a{" "}
            <a href="mailto:contact@jhonkarly.com">contact@jhonkarly.com</a>.
          </p>
        ),
      },
      {
        titulo: "Datos que recopilamos",
        contenido: (
          <>
            <p>Solo recopilamos los datos necesarios para el funcionamiento del sitio:</p>
            <ul>
              <li><strong>Cuentas de usuario:</strong> correo electrónico, nombre y rol de acceso, cuando se crea una cuenta en el área privada.</li>
              <li><strong>Comunicaciones:</strong> tu nombre, correo y el contenido del mensaje cuando nos escribes (solicitudes de prensa, compras, contacto general).</li>
              <li><strong>Datos técnicos:</strong> los registros mínimos que generan nuestros proveedores de alojamiento por motivos de seguridad (por ejemplo, dirección IP en logs del servidor).</li>
            </ul>
            <p>No recopilamos datos sensibles ni utilizamos herramientas de publicidad o rastreo comercial.</p>
          </>
        ),
      },
      {
        titulo: "Finalidad del tratamiento",
        contenido: (
          <ul>
            <li>Gestionar el acceso al área privada del sitio (cuentas, roles de prensa y contenido exclusivo).</li>
            <li>Responder solicitudes de contacto, de medios de comunicación y de compra de productos.</li>
            <li>Mantener la seguridad, prevenir abusos y cumplir obligaciones legales.</li>
          </ul>
        ),
      },
      {
        titulo: "Dónde se almacenan y cómo se protegen",
        contenido: (
          <p>
            Los datos de cuentas se almacenan en <strong>Supabase</strong> (infraestructura con
            cifrado en tránsito y en reposo) y el sitio se aloja en <strong>Vercel</strong>.
            Aplicamos controles de acceso por roles y políticas de seguridad a nivel de base de
            datos, de modo que cada usuario solo puede acceder a su propia información.
          </p>
        ),
      },
      {
        titulo: "Con quién compartimos datos",
        contenido: (
          <>
            <p>
              <strong>No vendemos ni alquilamos tus datos personales.</strong> Solo los comparten con
              nosotros, en calidad de encargados del tratamiento, los proveedores tecnológicos
              imprescindibles para operar el sitio (Supabase y Vercel), y las autoridades cuando la
              ley lo exija.
            </p>
            <p>
              El sitio contiene enlaces a plataformas de terceros (YouTube, Instagram, TikTok,
              pasarelas de pago, entre otras). Al visitarlas, aplican sus propias políticas de
              privacidad.
            </p>
          </>
        ),
      },
      {
        titulo: "Cookies y almacenamiento local",
        contenido: (
          <p>
            Este sitio no usa cookies publicitarias ni de analítica de terceros. Únicamente se
            utiliza el almacenamiento local del navegador para mantener tu sesión iniciada en el
            área privada. Puedes borrarlo en cualquier momento desde la configuración de tu
            navegador; solo perderás la sesión.
          </p>
        ),
      },
      {
        titulo: "Tus derechos (habeas data)",
        contenido: (
          <>
            <p>Como titular de los datos, en cualquier momento puedes:</p>
            <ul>
              <li>Conocer, actualizar y rectificar tus datos personales.</li>
              <li>Solicitar prueba de la autorización otorgada para su tratamiento.</li>
              <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio (Colombia).</li>
            </ul>
            <p>
              Para ejercer estos derechos escribe a{" "}
              <a href="mailto:contact@jhonkarly.com">contact@jhonkarly.com</a> indicando tu
              solicitud. Responderemos dentro de los plazos legales.
            </p>
          </>
        ),
      },
      {
        titulo: "Menores de edad",
        contenido: (
          <p>
            Este sitio no está dirigido a menores de edad y no creamos cuentas para menores sin
            autorización de sus representantes legales. Si crees que un menor nos ha facilitado
            datos, contáctanos para eliminarlos.
          </p>
        ),
      },
      {
        titulo: "Cambios a esta política",
        contenido: (
          <p>
            Podemos actualizar esta política para reflejar cambios legales o del sitio. La versión
            vigente estará siempre publicada en esta página con su fecha de actualización.
          </p>
        ),
      },
    ]}
  />
  );
};

export default Privacidad;
