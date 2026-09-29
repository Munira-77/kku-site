(() => {
  'use strict';

  const VAT_RATE = 0.15;
  const STORAGE_KEY = 'invoice-maker-draft-v1';
  const NEXT_INVOICE_KEY = 'invoice-maker-next-number-v1';
  const CUSTOM_CLIENTS_KEY = 'invoice-maker-custom-clients-v1';
  const LOCALE_KEY = 'invoice-maker-locale-v1';
  const THEME_KEY = 'invoice-maker-theme-v1';
  const UI_TRANSLATIONS = {
    en: {
      headerEyebrow: 'Small business toolkit',
      pageTitle: 'Invoice Maker',
      pageIntro: 'Create a clear invoice, check the totals, and print a professional copy.',
      privacyNote: 'Your draft stays in this browser.',
      languageControl: 'Language',
      languageEnglish: 'English',
      languageArabic: 'Arabic',
      themeDark: 'Dark theme',
      themeLight: 'Light theme',
      formTitle: 'Build your invoice',
      autosaveLabel: 'Auto-saves locally',
      businessDetails: 'Business details',
      businessName: 'Business name',
      businessAddress: 'Business address',
      businessPhone: 'Business phone',
      businessEmail: 'Business email',
      invoiceDetails: 'Invoice details',
      invoiceNumber: 'Invoice number',
      invoiceDate: 'Invoice date',
      savedClients: 'Saved Clients',
      chooseSavedClient: 'Choose a saved client',
      saveCurrentClient: 'Save Current Client',
      deleteSavedClient: 'Delete Saved Client',
      savedClientsHelp: 'Your saved clients stay only in this browser. Fictional examples cannot be changed or deleted.',
      customerDetails: 'Customer details',
      customerName: 'Customer name',
      customerAddress: 'Customer address',
      customerContact: 'Customer phone or email',
      itemsServices: 'Items / services',
      addItem: 'Add item',
      loadExample: 'Load Example',
      clearForm: 'Clear Form',
      printInvoice: 'Print Invoice',
      livePreview: 'Live preview',
      customerCatalog: 'Customer catalog',
      savedProductsEmpty: 'This customer has no saved products yet. Add one below to reuse it on future invoices.',
      productName: 'Product or service name',
      defaultUnitPrice: 'Default unit price (SAR)',
      saveProduct: 'Save Product',
      updatesAsType: 'Updates as you type',
      invoiceTitle: 'Invoice',
      invoiceNo: 'Invoice no.',
      dateLabel: 'Date',
      fromLabel: 'From',
      billTo: 'Bill To',
      thankYou: 'Thank you for your business.',
      subtotal: 'Subtotal',
      vat: 'VAT',
      totalIncludingVat: 'Total including VAT',
      practiceNote: 'Practice invoice template — verify local tax requirements before business use.'
    },
    ar: {
      headerEyebrow: 'أدوات الأعمال الصغيرة',
      pageTitle: 'منشئ الفواتير',
      pageIntro: 'أنشئ فاتورة واضحة، وراجع الإجماليات، واطبع نسخة احترافية.',
      privacyNote: 'تبقى مسودتك في هذا المتصفح.',
      languageControl: 'اللغة',
      languageEnglish: 'English',
      languageArabic: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
      themeDark: 'المظهر الداكن',
      themeLight: 'المظهر الفاتح',
      formTitle: 'أنشئ فاتورتك',
      autosaveLabel: 'يُحفظ محليًا',
      businessDetails: 'بيانات النشاط',
      businessName: 'اسم النشاط',
      businessAddress: 'عنوان النشاط',
      businessPhone: 'هاتف النشاط',
      businessEmail: 'بريد النشاط الإلكتروني',
      invoiceDetails: 'بيانات الفاتورة',
      invoiceNumber: 'رقم الفاتورة',
      invoiceDate: 'تاريخ الفاتورة',
      savedClients: 'العملاء المحفوظون',
      chooseSavedClient: 'اختر عميلًا محفوظًا',
      saveCurrentClient: 'حفظ العميل الحالي',
      deleteSavedClient: 'حذف العميل المحفوظ',
      savedClientsHelp: 'يبقى العملاء المحفوظون في هذا المتصفح فقط. لا يمكن تغيير الأمثلة الخيالية أو حذفها.',
      customerDetails: 'بيانات العميل',
      customerName: 'اسم العميل',
      customerAddress: 'عنوان العميل',
      customerContact: 'هاتف العميل أو بريده الإلكتروني',
      itemsServices: 'البنود / الخدمات',
      addItem: 'إضافة بند',
      loadExample: 'تحميل المثال',
      clearForm: 'مسح النموذج',
      printInvoice: 'طباعة الفاتورة',
      livePreview: 'معاينة مباشرة',
      customerCatalog: 'كتالوج العميل',
      savedProductsEmpty: 'لا يوجد لدى هذا العميل منتجات محفوظة بعد. أضف واحدًا بالأسفل لإعادة استخدامه في الفواتير القادمة.',
      productName: 'اسم المنتج أو الخدمة',
      defaultUnitPrice: 'سعر الوحدة الافتراضي (ريال)',
      saveProduct: 'حفظ المنتج',
      updatesAsType: 'يتحدث أثناء الكتابة',
      invoiceTitle: 'فاتورة',
      invoiceNo: 'رقم الفاتورة',
      dateLabel: 'التاريخ',
      fromLabel: 'من',
      billTo: 'إلى',
      thankYou: 'شكرًا لتعاملك معنا.',
      subtotal: 'المجموع الفرعي',
      vat: 'ضريبة القيمة المضافة',
      totalIncludingVat: 'الإجمالي شاملاً ضريبة القيمة المضافة',
      practiceNote: 'نموذج فاتورة للتدريب — تحقق من متطلبات الضرائب المحلية قبل الاستخدام التجاري.'
    }
  };
  const currencyFormatter = new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  let state;
  let activeLocale = 'en';
  let activeTheme = 'light';
  let customClients = [];
  let itemIdCounter = 0;
  let clientIdCounter = 0;
  let productIdCounter = 0;
  let pendingPrintInvoiceNumber = '';
  const elements = {};

  const createBlankItem = () => ({
    id: `item-${Date.now()}-${itemIdCounter += 1}`,
    description: '',
    quantity: '',
    unitPrice: ''
  });

  const getBlankState = () => ({
    business: { name: '', address: '', phone: '', email: '' },
    invoice: { number: '', date: '' },
    customer: { name: '', address: '', contact: '' },
    selectedClientId: '',
    items: [createBlankItem()]
  });

  const cloneState = (data) => JSON.parse(JSON.stringify(data));
  const normalizeText = (value) => String(value ?? '').trim();

  const normalizeNumberInput = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const number = Number(value);
    if (!Number.isFinite(number)) return '';
    return String(Math.max(0, number));
  };

  const normalizeProduct = (product) => ({
    id: normalizeText(product?.id),
    name: normalizeText(product?.name),
    unitPrice: normalizeNumberInput(product?.unitPrice)
  });

  const normalizeClient = (client) => ({
    id: normalizeText(client?.id),
    name: normalizeText(client?.name),
    address: normalizeText(client?.address),
    contact: normalizeText(client?.contact),
    products: Array.isArray(client?.products)
      ? client.products.map(normalizeProduct).filter((product) => product.id && product.name)
      : []
  });

  const createCustomProductId = () => `product-${Date.now()}-${productIdCounter += 1}`;
  const createCustomClientId = () => `client-${Date.now()}-${clientIdCounter += 1}`;

  const getClientIdentity = (client) => [client.name, client.address, client.contact]
    .map((value) => normalizeText(value).replace(/\s+/g, ' ').toLowerCase())
    .join('|');

  const getExampleClients = () => Array.isArray(window.SAVED_CLIENT_EXAMPLES)
    ? window.SAVED_CLIENT_EXAMPLES.map(normalizeClient).filter((client) => client.id && client.name)
    : [];

  const getAllClientOptions = () => [
    ...customClients.map((client) => ({ ...client, type: 'custom', optionValue: `custom:${client.id}` })),
    ...getExampleClients().map((client) => ({ ...client, type: 'example', optionValue: `example:${client.id}` }))
  ];

  const extractInvoiceSequence = (value) => {
    const invoiceNumber = String(value || '').trim();
    const currentFormat = /^INV-(\d+)$/i.exec(invoiceNumber);
    const legacyFormat = /^INV-.*-(\d+)$/i.exec(invoiceNumber);
    const match = currentFormat || legacyFormat;
    if (!match) return null;
    const sequence = Number(match[1]);
    return Number.isSafeInteger(sequence) && sequence > 0 ? sequence : null;
  };

  const formatInvoiceNumber = (sequence) => `INV-${String(sequence).padStart(4, '0')}`;

  const normalizeInvoiceNumber = (value) => {
    const sequence = extractInvoiceSequence(value);
    return /^INV-\d+$/i.test(String(value || '').trim()) || !sequence
      ? String(value || '').trim()
      : formatInvoiceNumber(sequence);
  };

  const getNextInvoiceSequence = () => {
    try {
      const value = Number(localStorage.getItem(NEXT_INVOICE_KEY));
      return Number.isSafeInteger(value) && value > 0 ? value : 1;
    } catch (error) {
      return 1;
    }
  };

  const saveNextInvoiceSequence = (sequence) => {
    try {
      localStorage.setItem(NEXT_INVOICE_KEY, String(sequence));
    } catch (error) {
      updateStatus('Your browser could not save the next invoice number, but you can still use the invoice maker.');
    }
  };

  const promoteSequenceFromInvoice = (invoiceNumber) => {
    const parsedSequence = extractInvoiceSequence(invoiceNumber);
    if (!parsedSequence) return;
    const nextSequence = getNextInvoiceSequence();
    if (parsedSequence >= nextSequence) saveNextInvoiceSequence(parsedSequence + 1);
  };

  const allocateInvoiceNumber = () => {
    const nextSequence = getNextInvoiceSequence();
    saveNextInvoiceSequence(nextSequence + 1);
    return formatInvoiceNumber(nextSequence);
  };

  const parseSelectedClient = (value) => {
    const match = /^(custom|example):(.+)$/.exec(String(value || ''));
    return match ? { type: match[1], id: match[2] } : null;
  };

  const sanitizeState = (data) => {
    const blank = getBlankState();
    const itemList = Array.isArray(data?.items) ? data.items : [];
    const validSelections = new Set(getAllClientOptions().map((client) => client.optionValue));
    return {
      business: { ...blank.business, ...(data?.business || {}) },
      invoice: {
        ...blank.invoice,
        ...(data?.invoice || {}),
        number: normalizeInvoiceNumber(data?.invoice?.number)
      },
      customer: { ...blank.customer, ...(data?.customer || {}) },
      selectedClientId: validSelections.has(data?.selectedClientId) ? data.selectedClientId : '',
      items: (itemList.length ? itemList : [createBlankItem()]).map((item) => ({
        id: item.id || createBlankItem().id,
        description: String(item.description ?? ''),
        quantity: normalizeNumberInput(item.quantity),
        unitPrice: normalizeNumberInput(item.unitPrice)
      }))
    };
  };

  const getNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  };

  const calculateLineTotal = (item) => getNumber(item.quantity) * getNumber(item.unitPrice);
  const calculateTotals = (items) => {
    const subtotal = items.reduce((total, item) => total + calculateLineTotal(item), 0);
    const vat = subtotal * VAT_RATE;
    return { subtotal, vat, grandTotal: subtotal + vat };
  };

  const formatSAR = (value) => currencyFormatter.format(Number.isFinite(value) ? value : 0);

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-SA', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const escapeAttribute = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const updateStatus = (message) => {
    if (elements.status) elements.status.textContent = message;
  };

  const t = (key, values = {}) => {
    const template = UI_TRANSLATIONS[activeLocale]?.[key] || UI_TRANSLATIONS.en[key] || key;
    return template.replace(/\{(\w+)\}/g, (match, name) => (
      Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
    ));
  };

  const getPreference = (key, supportedValues, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return supportedValues.includes(value) ? value : fallback;
    } catch (error) {
      return fallback;
    }
  };

  const savePreference = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Preferences remain usable for the current page session.
    }
  };

  const translateHeader = () => {
    const translations = UI_TRANSLATIONS[activeLocale];
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = translations[element.dataset.i18n];
      if (value) element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const value = translations[element.dataset.i18nAriaLabel];
      if (value) element.setAttribute('aria-label', value);
    });
  };

  const updatePreferenceControls = () => {
    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.locale === activeLocale));
    });
    if (elements.themeToggle) {
      elements.themeToggle.setAttribute('aria-pressed', String(activeTheme === 'dark'));
      elements.themeToggle.dataset.i18n = activeTheme === 'dark' ? 'themeLight' : 'themeDark';
      const label = UI_TRANSLATIONS[activeLocale][elements.themeToggle.dataset.i18n];
      if (label) elements.themeToggle.textContent = label;
    }
  };

  const setLocale = (locale) => {
    activeLocale = ['en', 'ar'].includes(locale) ? locale : 'en';
    document.documentElement.lang = activeLocale;
    document.documentElement.dir = activeLocale === 'ar' ? 'rtl' : 'ltr';
    savePreference(LOCALE_KEY, activeLocale);
    translateHeader();
    updatePreferenceControls();
    if (state) {
      const newProductDraft = elements.savedProductsPanel && !elements.savedProductsPanel.hidden
        ? { name: elements.newProductName.value, price: elements.newProductPrice.value }
        : null;
      renderAll();
      if (newProductDraft && !elements.savedProductsPanel.hidden) {
        elements.newProductName.value = newProductDraft.name;
        elements.newProductPrice.value = newProductDraft.price;
      }
    }
  };

  const setTheme = (theme) => {
    activeTheme = ['light', 'dark'].includes(theme) ? theme : 'light';
    document.documentElement.dataset.theme = activeTheme;
    document.documentElement.style.colorScheme = activeTheme;
    savePreference(THEME_KEY, activeTheme);
    updatePreferenceControls();
  };

  const loadSavedDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  };

  const saveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      updateStatus('Your browser could not save this draft, but you can still use the invoice maker.');
    }
  };

  const loadCustomClients = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(CUSTOM_CLIENTS_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      const seen = new Set();
      return saved.map(normalizeClient).filter((client) => {
        const identity = getClientIdentity(client);
        if (!client.id || !client.name || seen.has(identity)) return false;
        seen.add(identity);
        return true;
      });
    } catch (error) {
      return [];
    }
  };

  const saveCustomClients = () => {
    try {
      localStorage.setItem(CUSTOM_CLIENTS_KEY, JSON.stringify(customClients));
      return true;
    } catch (error) {
      updateStatus('Custom clients could not be saved in this browser, but the current invoice is unchanged.');
      return false;
    }
  };

  const setTextOrPlaceholder = (element, value, placeholder) => {
    const text = String(value || '').trim();
    element.textContent = text || placeholder;
    element.classList.toggle('placeholder-text', !text);
  };

  const getCustomClientById = (clientId) => customClients.find((client) => client.id === clientId) || null;

  const getSelectedCustomClient = (selectionValue = state?.selectedClientId) => {
    const selected = parseSelectedClient(selectionValue);
    return selected?.type === 'custom' ? getCustomClientById(selected.id) : null;
  };

  const updateCustomClientActions = (selectionValue = state?.selectedClientId) => {
    elements.deleteSavedClientButton.disabled = !getSelectedCustomClient(selectionValue);
  };

  const appendClientOptions = (group, clients, type, suffixKey = '') => {
    clients.forEach((client) => {
      const option = document.createElement('option');
      option.value = `${type}:${client.id}`;
      option.textContent = `${client.name}${suffixKey ? t(suffixKey) : ''}`;
      group.append(option);
    });
  };

  const renderSavedClientOptions = (selectionValue = state.selectedClientId) => {
    elements.savedClientSelector.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select client';
    elements.savedClientSelector.append(placeholder);
    if (customClients.length) {
      const customGroup = document.createElement('optgroup');
      customGroup.label = 'Your saved clients';
      appendClientOptions(customGroup, customClients, 'custom');
      elements.savedClientSelector.append(customGroup);
    }
    const examples = getExampleClients();
    if (examples.length) {
      const exampleGroup = document.createElement('optgroup');
      exampleGroup.label = 'Fictional example clients';
      appendClientOptions(exampleGroup, examples, 'example', ' — fictional example');
      elements.savedClientSelector.append(exampleGroup);
    }
    const validSelections = new Set(getAllClientOptions().map((client) => client.optionValue));
    if (!validSelections.has(selectionValue)) selectionValue = '';
    state.selectedClientId = selectionValue;
    elements.savedClientSelector.value = selectionValue;
    updateCustomClientActions(selectionValue);
  };

  const renderSavedProducts = (selectionValue = state.selectedClientId) => {
    const client = getSelectedCustomClient(selectionValue);
    elements.savedProductRows.replaceChildren();
    elements.newProductName.value = '';
    elements.newProductPrice.value = '';
    delete elements.savedProductsPanel.dataset.clientId;
    elements.savedProductsPanel.hidden = !client;
    if (!client) return;
    elements.savedProductsPanel.dataset.clientId = client.id;
    elements.savedProductsHeading.textContent = `Saved Products for ${client.name}`;
    const products = client.products || [];
    elements.savedProductsEmpty.hidden = products.length > 0;
    const loadAllButton = document.createElement('button');
    loadAllButton.className = 'button button-secondary load-client-products-button';
    loadAllButton.type = 'button';
    loadAllButton.dataset.loadClientProducts = client.id;
    loadAllButton.textContent = 'Load Client Products into Invoice';
    elements.savedProductRows.append(loadAllButton);
    elements.savedProductRows.insertAdjacentHTML('beforeend', products.map((product, index) => `
      <div class="saved-product-row" data-client-id="${escapeAttribute(client.id)}" data-product-id="${escapeAttribute(product.id)}">
        <div class="field">
          <label for="saved-product-name-${index}">Product or service name</label>
          <input id="saved-product-name-${index}" data-client-id="${escapeAttribute(client.id)}" data-product-id="${escapeAttribute(product.id)}" data-product-key="name" type="text" value="${escapeAttribute(product.name)}">
        </div>
        <div class="field">
          <label for="saved-product-price-${index}">Default price (SAR)</label>
          <input id="saved-product-price-${index}" data-client-id="${escapeAttribute(client.id)}" data-product-id="${escapeAttribute(product.id)}" data-product-key="unitPrice" type="number" min="0" step="0.01" inputmode="decimal" value="${escapeAttribute(product.unitPrice)}">
        </div>
        <button class="button button-secondary product-add-button" type="button" data-client-id="${escapeAttribute(client.id)}" data-add-product="${escapeAttribute(product.id)}">Add to Invoice</button>
        <button class="button button-danger product-delete-button" type="button" data-client-id="${escapeAttribute(client.id)}" data-delete-product="${escapeAttribute(product.id)}" aria-label="Delete ${escapeAttribute(product.name)}">Delete</button>
      </div>
    `).join(''));
  };

  const renderForm = () => {
    document.querySelectorAll('[data-section][data-key]').forEach((input) => {
      const { section, key } = input.dataset;
      input.value = state[section][key] ?? '';
    });
    const selectionValue = state.selectedClientId;
    renderSavedClientOptions(selectionValue);
    renderSavedProducts(selectionValue);
    renderItemRows();
  };

  const renderItemRows = () => {
    elements.itemRows.innerHTML = state.items.map((item, index) => `
      <div class="item-row" data-item-id="${escapeAttribute(item.id)}">
        <div class="item-input description-input">
          <label class="sr-only" for="item-description-${index}">Description for item ${index + 1}</label>
          <input id="item-description-${index}" data-item-id="${escapeAttribute(item.id)}" data-item-key="description" type="text" value="${escapeAttribute(item.description)}" placeholder="Service or item description">
        </div>
        <div class="item-input">
          <label class="sr-only" for="item-quantity-${index}">Quantity for item ${index + 1}</label>
          <input id="item-quantity-${index}" data-item-id="${escapeAttribute(item.id)}" data-item-key="quantity" type="number" min="0" step="any" inputmode="decimal" value="${escapeAttribute(item.quantity)}" placeholder="0">
        </div>
        <div class="item-input">
          <label class="sr-only" for="item-price-${index}">Unit price in SAR for item ${index + 1}</label>
          <input id="item-price-${index}" data-item-id="${escapeAttribute(item.id)}" data-item-key="unitPrice" type="number" min="0" step="0.01" inputmode="decimal" value="${escapeAttribute(item.unitPrice)}" placeholder="0.00">
        </div>
        <output class="line-total" aria-label="Line total for item ${index + 1}">${formatSAR(calculateLineTotal(item))}</output>
        <button class="remove-item-button" type="button" data-remove-item="${escapeAttribute(item.id)}" aria-label="Remove item ${index + 1}" title="Remove item">×</button>
      </div>
    `).join('');
    elements.itemCount.textContent = `${state.items.length} invoice items`;
    elements.itemsHelp.textContent = 'Add as many invoice items as you need. Quantity and price cannot be negative.';
  };

  const updateLineTotal = (itemId) => {
    const item = state.items.find((entry) => entry.id === itemId);
    const row = elements.itemRows.querySelector(`[data-item-id="${CSS.escape(itemId)}"]`);
    const output = row?.querySelector('.line-total');
    if (item && output) output.value = output.textContent = formatSAR(calculateLineTotal(item));
  };

  const renderPreviewItems = () => {
    elements.previewItems.replaceChildren();
    const visibleItems = state.items.filter((item) => String(item.description || '').trim() || getNumber(item.quantity) || getNumber(item.unitPrice));
    if (!visibleItems.length) {
      const row = document.createElement('tr');
      row.className = 'empty-item-row';
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.textContent = 'Add an item or service to see it on the invoice.';
      row.append(cell);
      elements.previewItems.append(row);
      return;
    }
    visibleItems.forEach((item) => {
      const row = document.createElement('tr');
      const cells = [
        item.description.trim() || 'Item or service description',
        getNumber(item.quantity) ? String(getNumber(item.quantity)) : '—',
        formatSAR(getNumber(item.unitPrice)),
        formatSAR(calculateLineTotal(item))
      ];
      cells.forEach((content, index) => {
        const cell = document.createElement('td');
        cell.textContent = content;
        if (index > 0) cell.className = 'numeric-cell';
        if (index === 0 && !item.description.trim()) cell.classList.add('placeholder-text');
        row.append(cell);
      });
      elements.previewItems.append(row);
    });
  };

  const renderPreview = () => {
    setTextOrPlaceholder(elements.preview.businessName, state.business.name, 'Your business name');
    setTextOrPlaceholder(elements.preview.businessAddress, state.business.address, 'Business address');
    setTextOrPlaceholder(elements.preview.businessPhone, state.business.phone, 'Business phone');
    setTextOrPlaceholder(elements.preview.businessEmail, state.business.email, 'Business email');
    setTextOrPlaceholder(elements.preview.invoiceNumber, state.invoice.number, 'INV-0001');
    setTextOrPlaceholder(elements.preview.invoiceDate, formatDate(state.invoice.date), 'Add invoice date');
    setTextOrPlaceholder(elements.preview.customerName, state.customer.name, 'Customer name');
    setTextOrPlaceholder(elements.preview.customerAddress, state.customer.address, 'Customer address');
    setTextOrPlaceholder(elements.preview.customerContact, state.customer.contact, 'Customer phone or email');
    renderPreviewItems();
    const totals = calculateTotals(state.items);
    elements.preview.subtotal.textContent = formatSAR(totals.subtotal);
    elements.preview.vat.textContent = formatSAR(totals.vat);
    elements.preview.total.textContent = formatSAR(totals.grandTotal);
  };

  const renderAll = () => {
    renderForm();
    renderPreview();
  };

  const findItem = (itemId) => state.items.find((item) => item.id === itemId);

  const handleFormInput = (event) => {
    const target = event.target;
    if (target.dataset.section && target.dataset.key) {
      state[target.dataset.section][target.dataset.key] = target.value;
      if (target.dataset.section === 'invoice' && target.dataset.key === 'number') promoteSequenceFromInvoice(target.value);
      if (target.dataset.section === 'customer') {
        state.selectedClientId = '';
        elements.savedClientSelector.value = '';
        updateCustomClientActions();
        renderSavedProducts();
      }
      renderPreview();
      saveDraft();
      return;
    }
    if (target.dataset.clientId && target.dataset.productId && target.dataset.productKey) {
      updateSavedProduct(target.dataset.clientId, target.dataset.productId, target.dataset.productKey, target.value);
      return;
    }
    if (target.dataset.itemId && target.dataset.itemKey) {
      const item = findItem(target.dataset.itemId);
      if (!item) return;
      const isNumeric = target.dataset.itemKey === 'quantity' || target.dataset.itemKey === 'unitPrice';
      const nextValue = isNumeric ? normalizeNumberInput(target.value) : target.value;
      item[target.dataset.itemKey] = nextValue;
      if (isNumeric && target.value !== nextValue) target.value = nextValue;
      updateLineTotal(item.id);
      renderPreview();
      saveDraft();
    }
  };

  const addItem = () => {
    state.items.push(createBlankItem());
    renderItemRows();
    renderPreview();
    saveDraft();
    updateStatus('A new item row was added.');
    elements.itemRows.querySelector('.item-row:last-child input')?.focus();
    return true;
  };

  const updateSavedProduct = (clientId, productId, key, value) => {
    const client = getCustomClientById(clientId);
    const product = client?.products.find((entry) => entry.id === productId);
    if (!product) return;
    product[key] = key === 'unitPrice' ? normalizeNumberInput(value) : normalizeText(value);
    if (key === 'unitPrice' && value !== product[key]) {
      const input = elements.savedProductRows.querySelector(`[data-client-id="${CSS.escape(clientId)}"][data-product-id="${CSS.escape(productId)}"][data-product-key="unitPrice"]`);
      if (input) input.value = product[key];
    }
    if (saveCustomClients()) updateStatus(`${client.name}'s saved product was updated.`);
  };

  const saveNewProduct = (clientId) => {
    const client = getCustomClientById(clientId);
    if (!client) {
      updateStatus('Select one of Your saved clients before saving a product.');
      return;
    }
    const name = normalizeText(elements.newProductName.value);
    const unitPrice = normalizeNumberInput(elements.newProductPrice.value);
    if (!name) {
      updateStatus('Enter a product or service name before saving it.');
      elements.newProductName.focus();
      return;
    }
    client.products.push({ id: createCustomProductId(), name, unitPrice });
    if (!saveCustomClients()) {
      client.products.pop();
      return;
    }
    renderSavedProducts(`custom:${client.id}`);
    updateStatus(`${name} was saved for ${client.name}.`);
  };

  const deleteSavedProduct = (clientId, productId) => {
    const client = getCustomClientById(clientId);
    const index = client?.products.findIndex((product) => product.id === productId) ?? -1;
    if (index < 0) return;
    const [product] = client.products.slice(index, index + 1);
    if (!window.confirm(`Delete ${product.name} from ${client.name}'s saved products?`)) return;
    client.products.splice(index, 1);
    if (!saveCustomClients()) {
      client.products.splice(index, 0, product);
      return;
    }
    renderSavedProducts(`custom:${client.id}`);
    updateStatus(`${product.name} was deleted from ${client.name}'s saved products.`);
  };

  const createInvoiceItemFromProduct = (product) => ({
    id: createBlankItem().id,
    description: product.name,
    quantity: '1',
    unitPrice: product.unitPrice
  });

  const addSavedProductToInvoice = (clientId, productId) => {
    const client = getCustomClientById(clientId);
    if (!client) {
      updateStatus('Select one of Your saved clients before adding a saved product to this invoice.');
      return;
    }
    const product = client.products.find((entry) => entry.id === productId);
    if (!product) {
      updateStatus('That saved product is no longer available for this customer.');
      return;
    }
    state.items.push(createInvoiceItemFromProduct(product));
    renderItemRows();
    renderPreview();
    saveDraft();
    updateStatus(`${product.name} was added to this invoice.`);
  };

  const loadClientProductsIntoInvoice = (clientId) => {
    const client = getCustomClientById(clientId);
    if (!client) {
      updateStatus('Select one of Your saved clients before loading products.');
      return;
    }
    if (!client.products.length) {
      updateStatus(`${client.name} has no saved products to load.`);
      return;
    }
    state.items.push(...client.products.map(createInvoiceItemFromProduct));
    renderItemRows();
    renderPreview();
    saveDraft();
    updateStatus(`${client.products.length} product${client.products.length === 1 ? '' : 's'} from ${client.name} were added to this invoice.`);
  };

  const removeItem = (itemId) => {
    const itemIndex = state.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;
    state.items.splice(itemIndex, 1);
    if (!state.items.length) state.items.push(createBlankItem());
    renderItemRows();
    renderPreview();
    saveDraft();
    updateStatus('Item removed.');
  };

  const applySavedClient = (selectionValue = elements.savedClientSelector.value) => {
    const selection = parseSelectedClient(selectionValue);
    const client = selection?.type === 'custom'
      ? getCustomClientById(selection.id)
      : getExampleClients().find((entry) => entry.id === selection?.id);
    if (!client) {
      state.selectedClientId = '';
      renderForm();
      saveDraft();
      return;
    }
    state.customer = { name: client.name, address: client.address, contact: client.contact };
    state.selectedClientId = `${selection.type}:${client.id}`;
    if (selection.type === 'custom') {
      state.items = client.products.length
        ? client.products.map((product) => createInvoiceItemFromProduct(product))
        : [createBlankItem()];
    }
    renderForm();
    renderPreview();
    saveDraft();
    updateStatus(selection.type === 'custom' && !client.products.length
      ? `No saved products for ${client.name}. Added one blank invoice item.`
      : `${client.name} was added to the customer details.`);
  };

  const saveCurrentClient = () => {
    const client = normalizeClient(state.customer);
    if (!client.name) {
      updateStatus('Enter a customer name before saving this client.');
      document.getElementById('customer-name').focus();
      return;
    }
    const identity = getClientIdentity(client);
    const duplicate = getAllClientOptions().find((entry) => getClientIdentity(entry) === identity);
    if (duplicate) {
      state.selectedClientId = duplicate.optionValue;
      renderForm();
      saveDraft();
      updateStatus(`${duplicate.name} is already in Saved Clients.`);
      return;
    }
    const selected = parseSelectedClient(state.selectedClientId);
    if (selected?.type === 'custom') {
      const index = customClients.findIndex((entry) => entry.id === selected.id);
      if (index !== -1) {
        customClients[index] = { ...client, id: selected.id, products: customClients[index].products || [] };
        if (!saveCustomClients()) return;
        state.selectedClientId = `custom:${selected.id}`;
        renderForm();
        saveDraft();
        updateStatus(`${client.name} was updated in Saved Clients.`);
        return;
      }
    }
    const customClient = { ...client, id: createCustomClientId() };
    customClients.push(customClient);
    if (!saveCustomClients()) {
      customClients.pop();
      return;
    }
    state.selectedClientId = `custom:${customClient.id}`;
    renderForm();
    saveDraft();
    updateStatus(`${customClient.name} was saved in this browser.`);
  };

  const deleteSavedClient = () => {
    const selected = parseSelectedClient(state.selectedClientId);
    if (selected?.type !== 'custom') return;
    const index = customClients.findIndex((client) => client.id === selected.id);
    if (index === -1) return;
    const [deletedClient] = customClients.splice(index, 1);
    if (!saveCustomClients()) {
      customClients.splice(index, 0, deletedClient);
      return;
    }
    state.selectedClientId = '';
    renderForm();
    saveDraft();
    updateStatus(`${deletedClient.name} was deleted from this browser.`);
    elements.savedClientSelector.focus();
  };

  const loadExample = () => {
    state = sanitizeState(cloneState(window.SAMPLE_INVOICE_DATA));
    state.invoice.number = allocateInvoiceNumber();
    promoteSequenceFromInvoice(state.invoice.number);
    renderAll();
    saveDraft();
    updateStatus('Made-up example invoice loaded with a new invoice number.');
  };

  const startNewInvoice = (statusMessage, focusBusinessName = false) => {
    state = getBlankState();
    state.invoice.number = allocateInvoiceNumber();
    renderAll();
    saveDraft();
    updateStatus(statusMessage(state.invoice.number));
    if (focusBusinessName) document.getElementById('business-name').focus();
  };

  const clearForm = () => {
    startNewInvoice((invoiceNumber) => `Form cleared. New invoice ${invoiceNumber} is ready.`, true);
  };

  const printInvoice = () => {
    if (pendingPrintInvoiceNumber) return;
    pendingPrintInvoiceNumber = state.invoice.number || 'this invoice';
    try {
      window.print();
    } catch (error) {
      pendingPrintInvoiceNumber = '';
      updateStatus('The print dialog could not be opened. Your current invoice was not changed.');
    }
  };

  const finishPrintedInvoice = () => {
    if (!pendingPrintInvoiceNumber) return;
    const printedInvoiceNumber = pendingPrintInvoiceNumber;
    pendingPrintInvoiceNumber = '';
    startNewInvoice((invoiceNumber) => `Printed invoice ${printedInvoiceNumber}. Started new invoice ${invoiceNumber}.`);
  };

  const cacheElements = () => {
    elements.form = document.getElementById('invoice-form');
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.itemRows = document.getElementById('item-rows');
    elements.addItemButton = document.getElementById('add-item-button');
    elements.itemCount = document.getElementById('item-count');
    elements.itemsHelp = document.getElementById('items-help');
    elements.status = document.getElementById('app-status');
    elements.savedClientSelector = document.getElementById('saved-client-selector');
    elements.saveCurrentClientButton = document.getElementById('save-current-client-button');
    elements.deleteSavedClientButton = document.getElementById('delete-saved-client-button');
    elements.savedProductsPanel = document.getElementById('saved-products-panel');
    elements.savedProductsHeading = document.getElementById('saved-products-heading');
    elements.savedProductsEmpty = document.getElementById('saved-products-empty');
    elements.savedProductRows = document.getElementById('saved-product-rows');
    elements.newProductName = document.getElementById('new-product-name');
    elements.newProductPrice = document.getElementById('new-product-price');
    elements.saveProductButton = document.getElementById('save-product-button');
    elements.previewItems = document.getElementById('preview-items');
    elements.preview = {
      businessName: document.getElementById('preview-business-name'),
      businessAddress: document.getElementById('preview-business-address'),
      businessPhone: document.getElementById('preview-business-phone'),
      businessEmail: document.getElementById('preview-business-email'),
      invoiceNumber: document.getElementById('preview-invoice-number'),
      invoiceDate: document.getElementById('preview-invoice-date'),
      customerName: document.getElementById('preview-customer-name'),
      customerAddress: document.getElementById('preview-customer-address'),
      customerContact: document.getElementById('preview-customer-contact'),
      subtotal: document.getElementById('preview-subtotal'),
      vat: document.getElementById('preview-vat'),
      total: document.getElementById('preview-total')
    };
  };

  const bindEvents = () => {
    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.addEventListener('click', () => setLocale(button.dataset.locale));
    });
    elements.themeToggle?.addEventListener('click', () => {
      setTheme(activeTheme === 'dark' ? 'light' : 'dark');
    });
    elements.form.addEventListener('input', handleFormInput);
    elements.addItemButton.addEventListener('click', addItem);
    elements.itemRows.addEventListener('click', (event) => {
      const removeButton = event.target.closest('[data-remove-item]');
      if (removeButton) removeItem(removeButton.dataset.removeItem);
    });
    elements.savedClientSelector.addEventListener('change', (event) => applySavedClient(event.currentTarget.value));
    elements.savedProductRows.addEventListener('click', (event) => {
      const loadButton = event.target.closest('[data-load-client-products]');
      const addButton = event.target.closest('[data-add-product]');
      const deleteButton = event.target.closest('[data-delete-product]');
      if (loadButton) loadClientProductsIntoInvoice(loadButton.dataset.loadClientProducts);
      if (addButton) addSavedProductToInvoice(addButton.dataset.clientId, addButton.dataset.addProduct);
      if (deleteButton) deleteSavedProduct(deleteButton.dataset.clientId, deleteButton.dataset.deleteProduct);
    });
    elements.saveProductButton.addEventListener('click', () => saveNewProduct(elements.savedProductsPanel.dataset.clientId));
    elements.saveCurrentClientButton.addEventListener('click', saveCurrentClient);
    elements.deleteSavedClientButton.addEventListener('click', deleteSavedClient);
    document.getElementById('load-example-button').addEventListener('click', loadExample);
    document.getElementById('clear-form-button').addEventListener('click', clearForm);
    document.getElementById('print-invoice-button').addEventListener('click', printInvoice);
    window.addEventListener('afterprint', finishPrintedInvoice);
  };

  const init = () => {
    cacheElements();
    activeLocale = getPreference(LOCALE_KEY, ['en', 'ar'], 'en');
    activeTheme = getPreference(THEME_KEY, ['light', 'dark'], 'light');
    setLocale(activeLocale);
    setTheme(activeTheme);
    customClients = loadCustomClients();
    const savedDraft = loadSavedDraft();
    state = sanitizeState(savedDraft || window.SAMPLE_INVOICE_DATA || getBlankState());
    promoteSequenceFromInvoice(state.invoice.number);
    if (!savedDraft) state.invoice.number = allocateInvoiceNumber();
    if (!state.invoice.number) state.invoice.number = allocateInvoiceNumber();
    renderAll();
    saveDraft();
    bindEvents();
  };

  init();
})();
