/**
 * D&D Character - Google Apps Script Backend
 * 
 * INSTRUCCIONES DE DESPLIEGUE:
 * 1. Crear una Google Spreadsheet nueva
 * 2. Ir a Extensiones > Apps Script
 * 3. Pegar este código completo
 * 4. Desplegar > Nueva implementación > Aplicación web
 *    - Ejecutar como: Yo
 *    - Acceso: Cualquier persona
 * 5. Copiar la URL del despliegue y pegarla en la app
 * 
 * ESTRUCTURA:
 * - Hoja "Índice": lista de personajes (ID, Nombre, Clase, Raza)
 * - Una hoja por personaje con secciones:
 *   INFO | ATRIBUTOS | COMBATE | SALVACIONES | HABILIDADES |
 *   MONEDAS | CONJUROS | RASGOS | INVENTARIO
 */

// ===================== ROUTING =====================

function doGet(e) {
  try {
    const action = e.parameter.action;
    let result;

    switch (action) {
      case 'list':
        result = listCharacters();
        break;
      case 'get':
        result = getCharacter(e.parameter.id);
        break;
      case 'create':
        result = createCharacter(e.parameter.name);
        break;
      case 'update':
        result = updateCharacter(e.parameter.id, e.parameter.data);
        break;
      case 'delete':
        result = deleteCharacter(e.parameter.id);
        break;
      case 'ping':
        result = { success: true, message: 'D&D Character conectado' };
        break;
      default:
        result = { error: 'Acción no válida: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===================== ÍNDICE =====================

function getIndexSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Índice');
  if (!sheet) {
    sheet = ss.insertSheet('Índice');
    sheet.appendRow(['ID', 'Nombre', 'Clase y Nivel', 'Raza', 'Hoja']);
    sheet.getRange('1:1').setFontWeight('bold');
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 120);
    sheet.setColumnWidth(5, 150);
  }
  return sheet;
}

function listCharacters() {
  const sheet = getIndexSheet();
  const data = sheet.getDataRange().getValues();
  const characters = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    characters.push({
      id: data[i][0],
      name: data[i][1],
      class_level: data[i][2],
      race: data[i][3],
    });
  }
  return { characters };
}

// ===================== LAYOUT DE LA HOJA =====================

// Definición de las secciones y sus campos con fila fija
// Esto permite leer/escribir por posición exacta
var LAYOUT = {
  INFO: {
    startRow: 1,
    fields: [
      { row: 2, key: 'name', label: 'Nombre' },
      { row: 3, key: 'class_level', label: 'Clase y Nivel' },
      { row: 4, key: 'race', label: 'Raza' },
      { row: 5, key: 'background', label: 'Trasfondo' },
      { row: 6, key: 'alignment', label: 'Alineamiento' },
      { row: 7, key: 'experience', label: 'Puntos de Experiencia' },
      { row: 8, key: 'player_name', label: 'Nombre del Jugador' },
      { row: 9, key: 'inspiration', label: 'Inspiración' },
    ]
  },
  ATRIBUTOS: {
    startRow: 11,
    fields: [
      { row: 12, key: 'strength', label: 'Fuerza' },
      { row: 13, key: 'dexterity', label: 'Destreza' },
      { row: 14, key: 'constitution', label: 'Constitución' },
      { row: 15, key: 'intelligence', label: 'Inteligencia' },
      { row: 16, key: 'wisdom', label: 'Sabiduría' },
      { row: 17, key: 'charisma', label: 'Carisma' },
      { row: 18, key: 'proficiency_bonus', label: 'Bonif. Competencia' },
    ]
  },
  COMBATE: {
    startRow: 20,
    fields: [
      { row: 21, key: 'armor_class', label: 'Clase de Armadura' },
      { row: 22, key: 'initiative', label: 'Iniciativa' },
      { row: 23, key: 'speed', label: 'Velocidad (ft)' },
      { row: 24, key: 'hp_max', label: 'PG Máximos' },
      { row: 25, key: 'hp_current', label: 'PG Actuales' },
      { row: 26, key: 'hp_temp', label: 'PG Temporales' },
      { row: 27, key: 'hit_dice', label: 'Dados de Golpe' },
      { row: 28, key: 'passive_perception', label: 'Percepción Pasiva' },
    ]
  },
  SALVACIONES: {
    startRow: 30,
    fields: [
      { row: 31, key: 'saving_throws.strength', label: 'Fuerza' },
      { row: 32, key: 'saving_throws.dexterity', label: 'Destreza' },
      { row: 33, key: 'saving_throws.constitution', label: 'Constitución' },
      { row: 34, key: 'saving_throws.intelligence', label: 'Inteligencia' },
      { row: 35, key: 'saving_throws.wisdom', label: 'Sabiduría' },
      { row: 36, key: 'saving_throws.charisma', label: 'Carisma' },
    ]
  },
  HABILIDADES: {
    startRow: 38,
    fields: [
      { row: 39, key: 'skills.acrobatics', label: 'Acrobacias' },
      { row: 40, key: 'skills.animal_handling', label: 'T. con Animales' },
      { row: 41, key: 'skills.arcana', label: 'Arcano' },
      { row: 42, key: 'skills.athletics', label: 'Atletismo' },
      { row: 43, key: 'skills.deception', label: 'Engaño' },
      { row: 44, key: 'skills.history', label: 'Historia' },
      { row: 45, key: 'skills.insight', label: 'Perspicacia' },
      { row: 46, key: 'skills.intimidation', label: 'Intimidación' },
      { row: 47, key: 'skills.investigation', label: 'Investigación' },
      { row: 48, key: 'skills.sleight_of_hand', label: 'Juego de Manos' },
      { row: 49, key: 'skills.medicine', label: 'Medicina' },
      { row: 50, key: 'skills.nature', label: 'Naturaleza' },
      { row: 51, key: 'skills.perception', label: 'Percepción' },
      { row: 52, key: 'skills.persuasion', label: 'Persuasión' },
      { row: 53, key: 'skills.religion', label: 'Religión' },
      { row: 54, key: 'skills.stealth', label: 'Sigilo' },
      { row: 55, key: 'skills.survival', label: 'Supervivencia' },
      { row: 56, key: 'other_proficiencies', label: 'Otras Competencias e Idiomas' },
    ]
  },
  MONEDAS: {
    startRow: 58,
    fields: [
      { row: 59, key: 'platinum', label: 'Platino (PPL)' },
      { row: 60, key: 'gold', label: 'Oro (PO)' },
      { row: 61, key: 'electrum', label: 'Electro (PE)' },
      { row: 62, key: 'silver', label: 'Plata (PP)' },
      { row: 63, key: 'copper', label: 'Cobre (PC)' },
    ]
  },
  CONJUROS: {
    startRow: 65,
    fields: [
      { row: 66, key: 'spellcasting_class', label: 'Clase Lanzadora' },
      { row: 67, key: 'spellcasting_ability', label: 'Aptitud Mágica' },
      { row: 68, key: 'spell_save_dc', label: 'CD Salvación' },
      { row: 69, key: 'spell_attack_bonus', label: 'Bonif. Ataque' },
      { row: 70, key: 'spell_slots.level_1_total', label: 'Nivel 1 - Total' },
      { row: 71, key: 'spell_slots.level_1_used', label: 'Nivel 1 - Usados' },
      { row: 72, key: 'spell_slots.level_2_total', label: 'Nivel 2 - Total' },
      { row: 73, key: 'spell_slots.level_2_used', label: 'Nivel 2 - Usados' },
      { row: 74, key: 'spell_slots.level_3_total', label: 'Nivel 3 - Total' },
      { row: 75, key: 'spell_slots.level_3_used', label: 'Nivel 3 - Usados' },
    ]
  },
  // Las listas (trucos, conjuros, rasgos, inventario) empiezan en fila 77
  LISTAS: {
    startRow: 77,
    // Estas son dinámicas, se manejan aparte
  },
  RASGOS: {
    startRow: 77, // se calcula dinámicamente tras listas de conjuros
  }
};

// Filas fijas para las listas de conjuros y otros
var LISTS_START = 77;

function initCharacterSheet(sheet) {
  // Cabeceras de sección (negrita, merge de columnas A+B)
  var sections = [
    { row: 1, title: '═══ INFORMACIÓN ═══' },
    { row: 11, title: '═══ ATRIBUTOS ═══' },
    { row: 20, title: '═══ COMBATE ═══' },
    { row: 30, title: '═══ TIRADAS DE SALVACIÓN ═══' },
    { row: 38, title: '═══ HABILIDADES ═══' },
    { row: 58, title: '═══ MONEDAS ═══' },
    { row: 65, title: '═══ CONJUROS ═══' },
  ];

  sections.forEach(function(s) {
    sheet.getRange(s.row, 1).setValue(s.title).setFontWeight('bold').setFontSize(11);
  });

  // Escribir etiquetas en columna A
  var allFields = [].concat(
    LAYOUT.INFO.fields,
    LAYOUT.ATRIBUTOS.fields,
    LAYOUT.COMBATE.fields,
    LAYOUT.SALVACIONES.fields,
    LAYOUT.HABILIDADES.fields,
    LAYOUT.MONEDAS.fields,
    LAYOUT.CONJUROS.fields
  );

  allFields.forEach(function(f) {
    sheet.getRange(f.row, 1).setValue(f.label);
  });

  // Formato
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 300);

  // Valores por defecto para booleanos
  LAYOUT.SALVACIONES.fields.forEach(function(f) {
    sheet.getRange(f.row, 2).setValue('No');
  });
  LAYOUT.HABILIDADES.fields.forEach(function(f) {
    if (f.key !== 'other_proficiencies') {
      sheet.getRange(f.row, 2).setValue('No');
    }
  });
  sheet.getRange(9, 2).setValue('No'); // Inspiración
}

// ===================== LEER HOJA → OBJETO =====================

function readCharacterFromSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return null;

  var char = { id: sheetName };

  // Leer campos fijos
  var sections = ['INFO', 'ATRIBUTOS', 'COMBATE', 'SALVACIONES', 'HABILIDADES', 'MONEDAS', 'CONJUROS'];
  sections.forEach(function(sec) {
    LAYOUT[sec].fields.forEach(function(f) {
      var val = sheet.getRange(f.row, 2).getValue();
      setNestedValue(char, f.key, parseValue(f.key, val));
    });
  });

  // Leer listas dinámicas (desde fila LISTS_START)
  var lastRow = sheet.getLastRow();
  var currentSection = '';
  var cantrips = [], spells1 = [], spells2 = [], spells3 = [];
  var traits = '', personality = '', ideals = '', bonds = '', flaws = '', equipment = '';
  var inventory = [];

  for (var r = LISTS_START; r <= lastRow; r++) {
    var cellA = String(sheet.getRange(r, 1).getValue()).trim();
    var cellB = String(sheet.getRange(r, 2).getValue()).trim();

    if (cellA.indexOf('═══') === 0) {
      currentSection = cellA;
      continue;
    }

    if (currentSection.indexOf('TRUCOS') >= 0 && cellA) {
      cantrips.push(cellA);
    } else if (currentSection.indexOf('CONJUROS NIVEL 1') >= 0 && cellA) {
      spells1.push(cellA);
    } else if (currentSection.indexOf('CONJUROS NIVEL 2') >= 0 && cellA) {
      spells2.push(cellA);
    } else if (currentSection.indexOf('CONJUROS NIVEL 3') >= 0 && cellA) {
      spells3.push(cellA);
    } else if (currentSection.indexOf('RASGOS') >= 0) {
      if (cellA === 'Rasgos y Atributos') traits = cellB;
      else if (cellA === 'Personalidad') personality = cellB;
      else if (cellA === 'Ideales') ideals = cellB;
      else if (cellA === 'Vínculos') bonds = cellB;
      else if (cellA === 'Defectos') flaws = cellB;
      else if (cellA === 'Equipo') equipment = cellB;
    } else if (currentSection.indexOf('INVENTARIO') >= 0 && cellA) {
      inventory.push(cellA);
    }
  }

  char.cantrips = cantrips;
  char.spells_level_1 = spells1;
  char.spells_level_2 = spells2;
  char.spells_level_3 = spells3;
  char.traits = traits;
  char.personality_traits = personality;
  char.ideals = ideals;
  char.bonds = bonds;
  char.flaws = flaws;
  char.equipment = equipment;
  char.inventory = inventory;

  return char;
}

function parseValue(key, val) {
  if (val === '' || val === null || val === undefined) return null;

  // Booleanos (salvaciones, habilidades, inspiración)
  if (key.indexOf('saving_throws.') === 0 || key.indexOf('skills.') === 0 || key === 'inspiration') {
    if (typeof val === 'boolean') return val;
    var s = String(val).toLowerCase().trim();
    return s === 'sí' || s === 'si' || s === 'yes' || s === 'true' || s === '1';
  }

  // Números
  var numericKeys = ['strength','dexterity','constitution','intelligence','wisdom','charisma',
    'proficiency_bonus','armor_class','initiative','speed','hp_max','hp_current','hp_temp',
    'passive_perception','spell_save_dc','spell_attack_bonus',
    'platinum','gold','electrum','silver','copper',
    'spell_slots.level_1_total','spell_slots.level_1_used',
    'spell_slots.level_2_total','spell_slots.level_2_used',
    'spell_slots.level_3_total','spell_slots.level_3_used'];
  
  if (numericKeys.indexOf(key) >= 0) {
    var n = Number(val);
    return isNaN(n) ? null : n;
  }

  return String(val);
}

function setNestedValue(obj, path, val) {
  var parts = path.split('.');
  if (parts.length === 1) {
    obj[parts[0]] = val;
  } else {
    if (!obj[parts[0]]) obj[parts[0]] = {};
    obj[parts[0]][parts[1]] = val;
  }
}

// ===================== ESCRIBIR OBJETO → HOJA =====================

function writeCharacterToSheet(sheetName, char) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;

  // Escribir campos fijos
  var sections = ['INFO', 'ATRIBUTOS', 'COMBATE', 'SALVACIONES', 'HABILIDADES', 'MONEDAS', 'CONJUROS'];
  sections.forEach(function(sec) {
    LAYOUT[sec].fields.forEach(function(f) {
      var val = getNestedValue(char, f.key);
      // Formatear booleanos
      if (f.key.indexOf('saving_throws.') === 0 || f.key.indexOf('skills.') === 0 || f.key === 'inspiration') {
        val = val ? 'Sí' : 'No';
      }
      if (val !== undefined && val !== null) {
        sheet.getRange(f.row, 2).setValue(val);
      }
    });
  });

  // Escribir listas dinámicas (borrar desde LISTS_START y reescribir)
  var lastRow = Math.max(sheet.getLastRow(), LISTS_START);
  if (lastRow >= LISTS_START) {
    sheet.getRange(LISTS_START, 1, lastRow - LISTS_START + 1, 2).clearContent();
  }

  var row = LISTS_START;

  // Trucos
  sheet.getRange(row, 1).setValue('═══ TRUCOS ═══').setFontWeight('bold');
  row++;
  (char.cantrips || []).forEach(function(s) {
    sheet.getRange(row, 1).setValue(s);
    row++;
  });
  row++;

  // Conjuros Nivel 1
  sheet.getRange(row, 1).setValue('═══ CONJUROS NIVEL 1 ═══').setFontWeight('bold');
  row++;
  (char.spells_level_1 || []).forEach(function(s) {
    sheet.getRange(row, 1).setValue(s);
    row++;
  });
  row++;

  // Conjuros Nivel 2
  sheet.getRange(row, 1).setValue('═══ CONJUROS NIVEL 2 ═══').setFontWeight('bold');
  row++;
  (char.spells_level_2 || []).forEach(function(s) {
    sheet.getRange(row, 1).setValue(s);
    row++;
  });
  row++;

  // Conjuros Nivel 3
  sheet.getRange(row, 1).setValue('═══ CONJUROS NIVEL 3 ═══').setFontWeight('bold');
  row++;
  (char.spells_level_3 || []).forEach(function(s) {
    sheet.getRange(row, 1).setValue(s);
    row++;
  });
  row++;

  // Rasgos
  sheet.getRange(row, 1).setValue('═══ RASGOS ═══').setFontWeight('bold');
  row++;
  var rasgoFields = [
    { label: 'Rasgos y Atributos', key: 'traits' },
    { label: 'Personalidad', key: 'personality_traits' },
    { label: 'Ideales', key: 'ideals' },
    { label: 'Vínculos', key: 'bonds' },
    { label: 'Defectos', key: 'flaws' },
    { label: 'Equipo', key: 'equipment' },
  ];
  rasgoFields.forEach(function(rf) {
    sheet.getRange(row, 1).setValue(rf.label);
    sheet.getRange(row, 2).setValue(char[rf.key] || '');
    row++;
  });
  row++;

  // Inventario
  sheet.getRange(row, 1).setValue('═══ INVENTARIO ═══').setFontWeight('bold');
  row++;
  (char.inventory || []).forEach(function(item) {
    sheet.getRange(row, 1).setValue(item);
    row++;
  });
}

function getNestedValue(obj, path) {
  var parts = path.split('.');
  if (parts.length === 1) return obj[parts[0]];
  if (!obj[parts[0]]) return undefined;
  return obj[parts[0]][parts[1]];
}

// ===================== CRUD =====================

function createCharacter(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var id = 'char_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 4);
  
  // Nombre limpio para la hoja (max 30 chars, sin caracteres especiales)
  var sheetName = (name || 'Nuevo').replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').substring(0, 25);
  // Evitar duplicados
  if (ss.getSheetByName(sheetName)) {
    sheetName = sheetName + ' ' + Math.floor(Math.random() * 99);
  }

  // Crear hoja del personaje
  var sheet = ss.insertSheet(sheetName);
  initCharacterSheet(sheet);
  sheet.getRange(2, 2).setValue(name || 'Nuevo Personaje');

  // Registrar en índice
  var index = getIndexSheet();
  index.appendRow([sheetName, name, '', '']);

  return {
    success: true,
    character: { id: sheetName, name: name || 'Nuevo Personaje' }
  };
}

function getCharacter(id) {
  var char = readCharacterFromSheet(id);
  if (!char) return { error: 'Personaje no encontrado: ' + id };
  return { character: char };
}

function updateCharacter(id, jsonData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(id);
  if (!sheet) return { error: 'Hoja no encontrada: ' + id };

  var updates = {};
  try { updates = JSON.parse(jsonData); } catch(e) { return { error: 'JSON inválido' }; }

  // Leer datos actuales
  var current = readCharacterFromSheet(id) || {};
  
  // Merge updates
  var merged = mergeDeep(current, updates);

  // Escribir todo
  writeCharacterToSheet(id, merged);

  // Actualizar índice
  updateIndex(id, merged);

  return { success: true, character: merged };
}

function deleteCharacter(id) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(id);
  if (sheet) ss.deleteSheet(sheet);

  // Borrar del índice
  var index = getIndexSheet();
  var data = index.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      index.deleteRow(i + 1);
      break;
    }
  }

  return { success: true };
}

function updateIndex(id, char) {
  var index = getIndexSheet();
  var data = index.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      var row = i + 1;
      index.getRange(row, 2).setValue(char.name || data[i][1]);
      index.getRange(row, 3).setValue(char.class_level || '');
      index.getRange(row, 4).setValue(char.race || '');
      return;
    }
  }
}

function mergeDeep(target, source) {
  var result = {};
  // Copy target
  for (var k in target) {
    if (target.hasOwnProperty(k)) result[k] = target[k];
  }
  // Merge source
  for (var k in source) {
    if (!source.hasOwnProperty(k)) continue;
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])
        && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
      result[k] = mergeDeep(target[k], source[k]);
    } else {
      result[k] = source[k];
    }
  }
  return result;
}
