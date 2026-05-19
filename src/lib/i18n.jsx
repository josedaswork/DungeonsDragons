import React, { createContext, useContext, useState, useCallback } from 'react';

const LANG_KEY = 'dnd_language';

const translations = {
  es: {
    // Abilities (full names)
    ability_strength: 'Fuerza',
    ability_dexterity: 'Destreza',
    ability_constitution: 'Constitución',
    ability_intelligence: 'Inteligencia',
    ability_wisdom: 'Sabiduría',
    ability_charisma: 'Carisma',

    // Ability abbreviations
    abbr_strength: 'FUE',
    abbr_dexterity: 'DES',
    abbr_constitution: 'CON',
    abbr_intelligence: 'INT',
    abbr_wisdom: 'SAB',
    abbr_charisma: 'CAR',

    // Ability group headers
    group_strength: 'Fuerza (FUE)',
    group_dexterity: 'Destreza (DES)',
    group_intelligence: 'Inteligencia (INT)',
    group_wisdom: 'Sabiduría (SAB)',
    group_charisma: 'Carisma (CAR)',

    // Skills
    skill_acrobatics: 'Acrobacias',
    skill_animal_handling: 'T. con Animales',
    skill_arcana: 'C. Arcano',
    skill_athletics: 'Atletismo',
    skill_deception: 'Engaño',
    skill_history: 'Historia',
    skill_insight: 'Perspicacia',
    skill_intimidation: 'Intimidación',
    skill_investigation: 'Investigación',
    skill_medicine: 'Medicina',
    skill_nature: 'Naturaleza',
    skill_perception: 'Percepción',
    skill_performance: 'Interpretación',
    skill_persuasion: 'Persuasión',
    skill_religion: 'Religión',
    skill_sleight_of_hand: 'Juego de Manos',
    skill_stealth: 'Sigilo',
    skill_survival: 'Supervivencia',

    // Character header
    no_name: 'Sin Nombre',
    class_unknown: 'Clase ?',
    player: 'Jugador',
    proficiency: 'Compet.\nProficiency',
    inspiration: 'Inspir.',
    save: 'Salv',

    // Tabs
    tab_combat: 'Combate',
    tab_skills: 'Habilidades',
    tab_spells: 'Conjuros',
    tab_traits: 'Rasgos',

    // Combat
    armor_class: 'Clase de Armadura',
    initiative: 'Iniciativa',
    speed: 'Velocidad',
    hit_points: 'Puntos de Golpe',
    hit_dice: 'Dados de Golpe',
    passive_perception: 'Percepción Pasiva',

    // Traits
    traits_and_features: 'Rasgos y Atributos',
    personality_traits: 'Rasgos de Personalidad',
    ideals: 'Ideales',
    bonds: 'Vínculos',
    flaws: 'Defectos',
    other_proficiencies: 'Otras Competencias e Idiomas',
    equipment: 'Equipo',

    // Spells
    spellcasting_ability: 'Aptitud Mágica',
    spell_save_dc: 'CD Salvación',
    spell_attack_bonus: 'Bonif. Ataque',
    spell_slots: 'Espacios de Conjuro',
    cantrips: 'Trucos',
    level: 'Nivel',
    spells_level: 'Conjuros Nivel',

    // Currency
    coins: 'Monedas',
    platinum: 'Platino',
    gold: 'Oro',
    electrum: 'Electro',
    silver: 'Plata',
    copper: 'Cobre',
    platinum_abbr: 'PPL',
    gold_abbr: 'PO',
    electrum_abbr: 'PE',
    silver_abbr: 'PP',
    copper_abbr: 'PC',

    // Inventory
    inventory: 'Inventario',
    items_count: 'objetos',
    no_items: 'Sin objetos',
    add_item: 'Añadir objeto...',

    // Edit modal
    edit_character: 'Editar Personaje',
    tab_info: 'Info',
    tab_attributes: 'Atributos',
    tab_coins: 'Monedas',
    name: 'Nombre',
    class_and_level: 'Clase y Nivel',
    race: 'Raza',
    background: 'Trasfondo',
    alignment: 'Alineamiento',
    experience: 'Puntos de Experiencia',
    player_name: 'Nombre del Jugador',
    proficiency_bonus: 'Bonificador de Competencia',
    saving_throws_proficiency: 'Tiradas de Salvación (Competencia)',
    skill_proficiencies: 'Competencias en Habilidades',
    speed_ft: 'Velocidad (ft)',
    hp_max: 'PG Máximos',
    hp_current: 'PG Actuales',
    hp_temp: 'PG Temporales',
    cancel: 'Cancelar',
    saving: 'Guardando...',
    save_changes: 'Guardar Cambios',
    spellcasting_class: 'Clase Lanzadora',
    level_total: 'Total',
    add_cantrips: 'Añadir trucos...',
    add_spells_level: 'Añadir conjuros nivel',

    // Character menu
    characters: 'Personajes',
    delete_confirm: '¿Eliminar este personaje?',
    no_characters: 'Sin personajes',
    new_character: 'Nuevo personaje',
    name_placeholder: 'Nombre...',
    character_created: 'Personaje creado',
    error_creating: 'Error creando personaje: ',
    character_deleted: 'Personaje eliminado',
    error_deleting: 'Error eliminando: ',

    // Character sheet
    error_loading_characters: 'Error cargando personajes: ',
    error_loading_character: 'Error cargando personaje: ',
    error_saving: 'Error guardando: ',
    character_saved: 'Personaje guardado',
    no_character: 'No hay personaje',
    no_character_hint: 'Abre el menú (☰) para crear tu primer personaje.',
    edit: 'Editar',

    // Setup screen
    app_title: 'D&D Character',
    setup_description: 'Conecta tu Google Spreadsheet para guardar tus personajes en la nube.',
    script_url_label: 'URL del Google Apps Script',
    connecting: 'Conectando...',
    connect_and_save: 'Conectar y Guardar',
    instructions: 'Instrucciones',
    step_1: 'Crea una nueva Google Spreadsheet',
    step_2: 'Ve a Extensiones → Apps Script',
    step_3: 'Copia el código con el botón de abajo y pégalo en el editor',
    step_4: 'Despliega como Aplicación web (acceso: cualquier persona)',
    step_5: 'Copia la URL y pégala arriba',
    code_copied: 'Código copiado',
    copy_code: 'Copiar código de Google Apps Script',
    enter_url: 'Introduce la URL del script',
    connection_error: 'Error conectando: ',

    // Language
    language: 'Idioma',
  },
  en: {
    ability_strength: 'Strength',
    ability_dexterity: 'Dexterity',
    ability_constitution: 'Constitution',
    ability_intelligence: 'Intelligence',
    ability_wisdom: 'Wisdom',
    ability_charisma: 'Charisma',

    abbr_strength: 'STR',
    abbr_dexterity: 'DEX',
    abbr_constitution: 'CON',
    abbr_intelligence: 'INT',
    abbr_wisdom: 'WIS',
    abbr_charisma: 'CHA',

    group_strength: 'Strength (STR)',
    group_dexterity: 'Dexterity (DEX)',
    group_intelligence: 'Intelligence (INT)',
    group_wisdom: 'Wisdom (WIS)',
    group_charisma: 'Charisma (CHA)',

    skill_acrobatics: 'Acrobatics',
    skill_animal_handling: 'Animal Handling',
    skill_arcana: 'Arcana',
    skill_athletics: 'Athletics',
    skill_deception: 'Deception',
    skill_history: 'History',
    skill_insight: 'Insight',
    skill_intimidation: 'Intimidation',
    skill_investigation: 'Investigation',
    skill_medicine: 'Medicine',
    skill_nature: 'Nature',
    skill_perception: 'Perception',
    skill_performance: 'Performance',
    skill_persuasion: 'Persuasion',
    skill_religion: 'Religion',
    skill_sleight_of_hand: 'Sleight of Hand',
    skill_stealth: 'Stealth',
    skill_survival: 'Survival',

    no_name: 'No Name',
    class_unknown: 'Class ?',
    player: 'Player',
    proficiency: 'Proficiency\nBonus',
    inspiration: 'Inspir.',
    save: 'Save',

    tab_combat: 'Combat',
    tab_skills: 'Skills',
    tab_spells: 'Spells',
    tab_traits: 'Traits',

    armor_class: 'Armor Class',
    initiative: 'Initiative',
    speed: 'Speed',
    hit_points: 'Hit Points',
    hit_dice: 'Hit Dice',
    passive_perception: 'Passive Perception',

    traits_and_features: 'Traits & Features',
    personality_traits: 'Personality Traits',
    ideals: 'Ideals',
    bonds: 'Bonds',
    flaws: 'Flaws',
    other_proficiencies: 'Other Proficiencies & Languages',
    equipment: 'Equipment',

    spellcasting_ability: 'Spellcasting Ability',
    spell_save_dc: 'Spell Save DC',
    spell_attack_bonus: 'Spell Attack',
    spell_slots: 'Spell Slots',
    cantrips: 'Cantrips',
    level: 'Level',
    spells_level: 'Spells Level',

    coins: 'Currency',
    platinum: 'Platinum',
    gold: 'Gold',
    electrum: 'Electrum',
    silver: 'Silver',
    copper: 'Copper',
    platinum_abbr: 'PP',
    gold_abbr: 'GP',
    electrum_abbr: 'EP',
    silver_abbr: 'SP',
    copper_abbr: 'CP',

    inventory: 'Inventory',
    items_count: 'items',
    no_items: 'No items',
    add_item: 'Add item...',

    edit_character: 'Edit Character',
    tab_info: 'Info',
    tab_attributes: 'Attributes',
    tab_coins: 'Currency',
    name: 'Name',
    class_and_level: 'Class & Level',
    race: 'Race',
    background: 'Background',
    alignment: 'Alignment',
    experience: 'Experience Points',
    player_name: 'Player Name',
    proficiency_bonus: 'Proficiency Bonus',
    saving_throws_proficiency: 'Saving Throws (Proficiency)',
    skill_proficiencies: 'Skill Proficiencies',
    speed_ft: 'Speed (ft)',
    hp_max: 'Max HP',
    hp_current: 'Current HP',
    hp_temp: 'Temp HP',
    cancel: 'Cancel',
    saving: 'Saving...',
    save_changes: 'Save Changes',
    spellcasting_class: 'Spellcasting Class',
    level_total: 'Total',
    add_cantrips: 'Add cantrips...',
    add_spells_level: 'Add level spells',

    characters: 'Characters',
    delete_confirm: 'Delete this character?',
    no_characters: 'No characters',
    new_character: 'New character',
    name_placeholder: 'Name...',
    character_created: 'Character created',
    error_creating: 'Error creating character: ',
    character_deleted: 'Character deleted',
    error_deleting: 'Error deleting: ',

    error_loading_characters: 'Error loading characters: ',
    error_loading_character: 'Error loading character: ',
    error_saving: 'Error saving: ',
    character_saved: 'Character saved',
    no_character: 'No character',
    no_character_hint: 'Open the menu (☰) to create your first character.',
    edit: 'Edit',

    app_title: 'D&D Character',
    setup_description: 'Connect your Google Spreadsheet to save your characters in the cloud.',
    script_url_label: 'Google Apps Script URL',
    connecting: 'Connecting...',
    connect_and_save: 'Connect & Save',
    instructions: 'Instructions',
    step_1: 'Create a new Google Spreadsheet',
    step_2: 'Go to Extensions → Apps Script',
    step_3: 'Copy the code with the button below and paste it in the editor',
    step_4: 'Deploy as Web app (access: anyone)',
    step_5: 'Copy the URL and paste it above',
    code_copied: 'Code copied',
    copy_code: 'Copy Google Apps Script code',
    enter_url: 'Enter the script URL',
    connection_error: 'Connection error: ',

    language: 'Language',
  },
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'es');

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  }, []);

  const t = useCallback((key) => translations[lang]?.[key] ?? translations.es[key] ?? key, [lang]);

  return (
    <I18nContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
