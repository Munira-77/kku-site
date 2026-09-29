(() => {
  const toIsoDate = (date) => date.toISOString().slice(0, 10);
  const today = new Date();
  const issueDate = new Date(today);
  issueDate.setDate(today.getDate() - 2);

  window.SAVED_CLIENT_EXAMPLES = [
    {
      id: 'azure-canvas',
      name: 'Azure Canvas Co.',
      address: 'Example Arts District, Riyadh, Saudi Arabia',
      contact: 'accounts@azurecanvas.example'
    },
    {
      id: 'palm-pantry',
      name: 'Palm Pantry Kitchen',
      address: 'Sample Corniche Area, Jeddah, Saudi Arabia',
      contact: 'billing@palmpantry.example'
    },
    {
      id: 'lumen-workshop',
      name: 'Lumen Workshop',
      address: 'Fictional Garden Quarter, Dammam, Saudi Arabia',
      contact: 'finance@lumenworkshop.example'
    }
  ];

  window.SAMPLE_INVOICE_DATA = {
    business: {
      name: 'Desert Bloom Studio',
      address: 'Example District, Riyadh, Saudi Arabia',
      phone: '',
      email: 'hello@desertbloom.example'
    },
    invoice: {
      number: 'INV-0001',
      date: toIsoDate(issueDate)
    },
    customer: {
      name: 'Harbor & Pine Co.',
      address: 'Sample Quarter, Jeddah, Saudi Arabia',
      contact: 'accounts@harborpine.example'
    },
    items: [
      { id: 'sample-1', description: 'Brand consultation session', quantity: '2', unitPrice: '450' },
      { id: 'sample-2', description: 'Product photography package', quantity: '1', unitPrice: '1250' },
      { id: 'sample-3', description: 'Social media launch kit', quantity: '1', unitPrice: '780' }
    ]
  };
})();
