//#######################################
// Crear Custom Values Copleto de prueba ir reemplazon los values


// ==== CONFIG ====
	const SOCIAL_VALUES = [
	  { name: "link_instagram", value: "https://instagram.com/yourbrand" },
	  { name: "link_tiktok",    value: "https://tiktok.com/@yourbrand" },
	  { name: "link_facebook",  value: "https://facebook.com/yourbrand" }
	];

	// ==== script luego de los datos ====
		const sleep = (ms) => new Promise(r => setTimeout(r, ms));

		function modalOpen() {
		  return !!document.querySelector('#confirm-edit-custom-value');
		}

		async function waitForModalClose(timeoutMs = 3000) {
		  const start = performance.now();
		  while (performance.now() - start < timeoutMs) {
		    if (!modalOpen()) return true;
		    await sleep(100);
		  }
		  return !modalOpen();
		}

		async function createCustomValue({name, value}) {
		  // 1) abrir modal
		  const addBtn = document.querySelector('#add-custom-value-button');
		  if (!addBtn) throw new Error('No #add-custom-value-button');
		  addBtn.click();
		  await sleep(150);

		  // 2) inputs
		  const nameInput  = document.querySelector('#custom-value-name input');
		  const valueInput = document.querySelector('#custom-value-value input');
		  if (!nameInput || !valueInput) throw new Error('No inputs del modal');

		  // limpiar y escribir
		  nameInput.focus();  nameInput.value = '';  nameInput.dispatchEvent(new Event('input',{bubbles:true}));
		  valueInput.focus(); valueInput.value = ''; valueInput.dispatchEvent(new Event('input',{bubbles:true}));

		  nameInput.value = name;   nameInput.dispatchEvent(new Event('input',{bubbles:true}));
		  valueInput.value = value; valueInput.dispatchEvent(new Event('input',{bubbles:true}));

		  await sleep(50);

		  // 3) click Create
		  const createBtn = document.querySelector('#confirm-edit-custom-value');
		  if (!createBtn) throw new Error('No #confirm-edit-custom-value');
		  createBtn.click();

		  // 4) esperar cierre de modal
		  let closed = await waitForModalClose(3000);
		  if (!closed) {
		    console.warn('Modal no cerró; reintentando Create…');
		    // un pequeño retry por si el primer click no “entró”
		    createBtn.click();
		    closed = await waitForModalClose(3000);
		  }

		  if (!closed) {
		    throw new Error('El modal no cerró tras crear (revisa este item manualmente).');
		  }
		}

		(async () => {
		  console.log('Creando Custom Values (social) con esperas seguras…');
		  for (const item of SOCIAL_VALUES) {
		    try {
		      await createCustomValue(item);
		      console.log('✅ Creado:', item.name);
		      // pausa corta entre items para evitar colas internas
		      await sleep(200);
		    } catch (e) {
		      console.error('❌ Problema con', item.name, e.message || e);
		      // continua con el siguiente sin romper el batch
		      await sleep(300);
		    }
		  }
		  console.log('🎉 Fin. Si no ves todos, pulsa Refresh o cambia de pestaña (Folders/All Values) para forzar la recarga de la tabla.');
		})();




//#######################################
// Crear Custom Values de Redes sociales


		// ==== CONFIG ====
		const SOCIAL_VALUES = [
		  { name: "link_schedule",        value: "https://url.com/schedule" }, 
		  { name: "link_call",        value: "tel:00000" }
		  { name: "link_email",       value: "mailto:hello@yourbrand.com" },
		  { name: "link_facebook",    value: "https://facebook.com/yourbrand" },
		  { name: "link_instagram",   value: "https://instagram.com/yourbrand" },
		  { name: "link_linkedin",    value: "https://linkedin.com/company/yourbrand" },
		  { name: "link_membership",  value: "https://url.com/membership" },
		  { name: "link_pinterest",   value: "https://pinterest.com/yourbrand" },
		  { name: "link_shop",        value: "https://url.com/shop" },
		  { name: "link_telegram",    value: "https://t.me/yourbrand" },
		  { name: "link_threads",     value: "https://www.threads.net/@yourbrand" },
		  { name: "link_tiktok",      value: "https://tiktok.com/@yourbrand" },
		  { name: "link_whatsapp",    value: "https://wa.me/13055551234?text=Hi%20there!" },
		  { name: "link_x",           value: "https://x.com/yourbrand" },
		  { name: "link_youtube",     value: "https://youtube.com/@yourbrand" },
		  { name: "link_google",     value: "url" },

		];


//#######################################
// Crear Custom Values de Brand Info


//todos

	const BRAND_VALUES = [
	  { name: "address_full", value: "123 Main Street, City, State ZIP" },
	  { name: "brand_name", value: "Your company name" },
	  { name: "business_id", value: "Business ID / EIN" },
	  { name: "company_type", value: "LLC / Inc. / S.A." },
	  { name: "cookie_categories", value: "Essential, Analytics, Marketing" },
	  { name: "cookie_thirdparty", value: "Google Analytics, Meta Pixel, etc." },
	  { name: "country", value: "Country" },
	  { name: "currency", value: "USD" },
	  { name: "email_main", value: "yourmail@hub365.ai" },
	  { name: "email_support", value: "support@hub365.ai" },
	  { name: "email_privacy", value: "{{custom_values.email_support}}" },
	  { name: "legal_jurisdiction", value: "State / Country of jurisdiction" },
	  { name: "legal_name", value: "Your legal company name (LLC/Inc.)" },
	  { name: "link_map", value: "https://maps.google.com/?q=Your+Address" },
	  { name: "payment_provider", value: "Stripe / PayPal" },
	  { name: "phone_main", value: "+12 345 6789" },
	  { name: "privacy_regulation", value: "GDPR / CCPA / Local law" },
	  { name: "timezone", value: "America/New_York" },
	  { name: "website_url", value: "https://yourcompany.com" }
		{ name: "person_name", value: "Nombre del CEO" }
	];



// Ordenados 
	const BRAND_VALUES = [

	  // Datos básicos
	  { name: "brand_name", value: "Your company name" },
	  { name: "legal_name", value: "Your legal company name (LLC/Inc.)" },
	  { name: "company_type", value: "LLC / Inc. / S.A." },
	  { name: "business_id", value: "Business ID / EIN" },
	  { name: "country", value: "Country" },
	  { name: "legal_jurisdiction", value: "State / Country of jurisdiction" },
	  { name: "person_name", value: "Nombre del CEO" },
	  

	  // Contacto
	  { name: "address_full", value: "123 Main Street, City, State ZIP" },	  
	  { name: "legal_address_full", value: "123 Main Street, City, State ZIP" },
	  { name: "phone_main", value: "+12 345 6789" },
	  { name: "email_main", value: "yourmail@hub365.ai" },
	  { name: "email_support", value: "support@hub365.ai" },
	  { name: "email_privacy", value: "{{custom_values.email_support}}" },

	  // Web
	  { name: "website_url", value: "https://yourcompany.com" },
	  { name: "link_map", value: "https://maps.google.com/?q=Your+Address" },

	  // Legal / privacidad / cookies
	  { name: "privacy_regulation", value: "GDPR / CCPA / Local law" },
	  { name: "cookie_categories", value: "Essential, Analytics, Marketing" },
	  { name: "cookie_thirdparty", value: "Google Analytics, Meta Pixel, etc." },

	  // Finanzas / Pagos
	  { name: "currency", value: "USD" },
	  { name: "payment_provider", value: "Stripe / PayPal" },

	  // ─── Políticas y Términos (URLs) ───
	  { name: "terms_of_use", value: "url" },
	  { name: "privacy_policy", value: "url" },
	  { name: "cookies_policy", value: "url" },
	  { name: "return_policy", value: "url" },
	  { name: "disclaimers", value: "url" },


	  // Otros
	  { name: "timezone", value: "America/New_York" },

	];





//#######################################
// Crear Custom Values de BrandBoard

// ======= BRAND VISUALS – Script de Abdiel para Custom Values =======

// Lista de valores a crear (puedes editar los links o hex)
	const BRAND_VISUALS = [
	  { name: "color_white",     value: "#fdfdfd" },
	  { name: "color_black",     value: "#161616" },	  
	  { name: "color_primary",   value: "#ff4ef8" },
	  { name: "color_secondary", value: "#5de3e8" },
	  { name: "color_accent",    value: "#ccff00" },
	  { name: "color_highlight", value: "#ffd700" },
	  { name: "favicon_url",     value: "https://storage.googleapis.com/msgsndr/rpfGXwQGWBN80QBxnzZh/media/682b39660ed506890c43a865.png" },
	  { name: "hero_img",        value: "https://raw.githubusercontent.com/abdieldesigner/recursos/refs/heads/main/Powered%20by%20hub365%20ai%20v2.svg" },
	  { name: "logo_dark_h",     value: "https://raw.githubusercontent.com/abdieldesigner/recursos/refs/heads/main/Powered%20by%20hub365%20ai%20v2.svg" },
	  { name: "logo_dark_v",     value: "https://raw.githubusercontent.com/abdieldesigner/recursos/refs/heads/main/Powered%20by%20hub365%20ai%20v2.svg" },
	  { name: "logo_light_h",    value: "https://raw.githubusercontent.com/abdieldesigner/recursos/refs/heads/main/Powered%20by%20hub365%20ai%20v2.svg" },
	  { name: "logo_light_v",    value: "https://raw.githubusercontent.com/abdieldesigner/recursos/refs/heads/main/Powered%20by%20hub365%20ai%20v2.svg" }
	];










const SOCIAL_VALUES = [
  { name: "address_full", value: "-----" },
  { name: "brand_name", value: "FNA Peptides" },
  { name: "business_id", value: "-----" },
  { name: "company_type", value: "-----" },
  { name: "cookie_categories", value: "Essential, Analytics, Marketing, Functional" },
  { name: "cookie_thirdparty", value: "Google Analytics, Meta Pixel, payment processors and website hosting providers" },
  { name: "country", value: "United States" },
  { name: "currency", value: "USD" },
  { name: "email_main", value: "Support@fnapeptides.com" },
  { name: "email_support", value: "Support@fnapeptides.com" },
  { name: "email_privacy", value: "{{custom_values.email_support}}" },
  { name: "legal_jurisdiction", value: "United States" },
  { name: "legal_name", value: "FNA Peptides" },
  { name: "link_map", value: "-----" },
  { name: "payment_provider", value: "-----" },
  { name: "phone_main", value: "+1 720-222-4725" },
  { name: "privacy_regulation", value: "Applicable United States federal and state privacy laws" },
  { name: "timezone", value: "America/New_York" },
  { name: "website_url", value: "https://fnapeptides.com" },
  { name: "person_name", value: "-----" }
];



  // ==== script luego de los datos ====
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function modalOpen() {
      return !!document.querySelector('#confirm-edit-custom-value');
    }

    async function waitForModalClose(timeoutMs = 3000) {
      const start = performance.now();
      while (performance.now() - start < timeoutMs) {
        if (!modalOpen()) return true;
        await sleep(100);
      }
      return !modalOpen();
    }

    async function createCustomValue({name, value}) {
      // 1) abrir modal
      const addBtn = document.querySelector('#add-custom-value-button');
      if (!addBtn) throw new Error('No #add-custom-value-button');
      addBtn.click();
      await sleep(150);

      // 2) inputs
      const nameInput  = document.querySelector('#custom-value-name input');
      const valueInput = document.querySelector('#custom-value-value input');
      if (!nameInput || !valueInput) throw new Error('No inputs del modal');

      // limpiar y escribir
      nameInput.focus();  nameInput.value = '';  nameInput.dispatchEvent(new Event('input',{bubbles:true}));
      valueInput.focus(); valueInput.value = ''; valueInput.dispatchEvent(new Event('input',{bubbles:true}));

      nameInput.value = name;   nameInput.dispatchEvent(new Event('input',{bubbles:true}));
      valueInput.value = value; valueInput.dispatchEvent(new Event('input',{bubbles:true}));

      await sleep(50);

      // 3) click Create
      const createBtn = document.querySelector('#confirm-edit-custom-value');
      if (!createBtn) throw new Error('No #confirm-edit-custom-value');
      createBtn.click();

      // 4) esperar cierre de modal
      let closed = await waitForModalClose(3000);
      if (!closed) {
        console.warn('Modal no cerró; reintentando Create…');
        // un pequeño retry por si el primer click no “entró”
        createBtn.click();
        closed = await waitForModalClose(3000);
      }

      if (!closed) {
        throw new Error('El modal no cerró tras crear (revisa este item manualmente).');
      }
    }

    (async () => {
      console.log('Creando Custom Values (social) con esperas seguras…');
      for (const item of SOCIAL_VALUES) {
        try {
          await createCustomValue(item);
          console.log('✅ Creado:', item.name);
          // pausa corta entre items para evitar colas internas
          await sleep(200);
        } catch (e) {
          console.error('❌ Problema con', item.name, e.message || e);
          // continua con el siguiente sin romper el batch
          await sleep(300);
        }
      }
      console.log('🎉 Fin. Si no ves todos, pulsa Refresh o cambia de pestaña (Folders/All Values) para forzar la recarga de la tabla.');
    })();


