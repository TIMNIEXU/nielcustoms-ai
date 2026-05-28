const formidable = require('formidable');
const fs = require('fs');
const XLSX = require('xlsx');

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function flattenFiles(files) {
  const list = [];
  Object.values(files || {}).forEach((value) => {
    if (Array.isArray(value)) list.push(...value);
    else if (value) list.push(value);
  });
  return list;
}

function readExcelPreview(file) {
  try {
    const workbook = XLSX.readFile(file.filepath);
    const firstSheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1, raw: false });
    return rows.slice(0, 25).map((row) => row.join(' | ')).join('\n');
  } catch (error) {
    return '';
  }
}

function getTextPreview(file) {
  const name = (file.originalFilename || '').toLowerCase();
  const type = (file.mimetype || '').toLowerCase();

  if (name.endsWith('.xls') || name.endsWith('.xlsx')) {
    return readExcelPreview(file);
  }

  if (type.includes('text') || name.endsWith('.csv') || name.endsWith('.txt')) {
    try {
      return fs.readFileSync(file.filepath, 'utf8').slice(0, 6000);
    } catch (error) {
      return '';
    }
  }

  return '';
}

function inferReview(files) {
  const combined = files.map((file) => `${file.originalFilename || ''}\n${getTextPreview(file)}`).join('\n').toLowerCase();

  let hts = 'Pending broker review';
  let duty = 'Pending document review';
  let section301 = 'Pending origin/HTS review';
  let bond = 'Single Transaction Bond or Continuous Bond to be confirmed';
  let risk = 'Document received. Human customs review recommended before entry filing.';

  if (combined.includes('aluminum') || combined.includes('aluminium')) {
    hts = 'Possible aluminum article classification — requires broker review';
    duty = 'May include general duty plus possible additional trade remedies';
    section301 = combined.includes('china') ? 'Possible Section 301 risk if origin is China' : 'Origin review required';
    bond = 'Continuous Bond recommended if importer has recurring shipments';
    risk = 'Check HTS, origin, Section 301, and possible aluminum-specific trade remedy exposure.';
  }

  if (combined.includes('invoice') || combined.includes('commercial')) {
    risk += ' Commercial invoice appears to be included.';
  }
  if (combined.includes('packing')) {
    risk += ' Packing list appears to be included.';
  }
  if (combined.includes('bill of lading') || combined.includes('b/l') || combined.includes('bol')) {
    risk += ' B/L appears to be included.';
  }

  return { hts, duty, section301, bond, risk };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFiles = flattenFiles(files);

    if (!uploadedFiles.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const review = inferReview(uploadedFiles);

    return res.status(200).json({
      ok: true,
      fileCount: uploadedFiles.length,
      files: uploadedFiles.map((file) => ({
        name: file.originalFilename,
        size: file.size,
        type: file.mimetype,
      })),
      hts: review.hts,
      duty: review.duty,
      section301: review.section301,
      bond: review.bond,
      status: 'Ready for broker review',
      riskNotes: review.risk,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Analyze API error',
      message: error.message,
    });
  }
};
