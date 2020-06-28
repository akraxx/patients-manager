export class Antecedent {
    title: string;
    category?: string;
    important: boolean;
    value: string;
}

export class AntecedentCategory {
    title: string;
    antecedents: Antecedent[];
}

export const DEFAULT_ANTECEDENTS: Antecedent[] = [
    {
        title: 'Médecine',
        category: 'Actuellement',
        important: false,
        value: '',
    },
    {
        title: 'Psychologie',
        category: 'Actuellement',
        important: false,
        value: '',
    },
    {
        title: 'Traitement médical',
        category: 'Actuellement',
        important: false,
        value: '',
    },
    {
        title: 'Décès',
        category: 'Antécédents familiaux',
        important: false,
        value: '',
    },
    {
        title: 'Accouchements',
        category: 'Antécédents familiaux',
        important: false,
        value: '',
    },
    {
        title: 'Autre',
        category: 'Antécédents familiaux',
        important: false,
        value: '',
    },
    {
        title: 'Entorse',
        category: 'Antécédents traumas',
        important: false,
        value: '',
    },
    {
        title: 'Fracture',
        category: 'Antécédents traumas',
        important: false,
        value: '',
    },
    {
        title: 'Luxation',
        category: 'Antécédents traumas',
        important: false,
        value: '',
    },
    {
        title: 'AVP',
        category: 'Antécédents traumas',
        important: false,
        value: '',
    },
    {
        title: 'Chutes',
        category: 'Antécédents traumas',
        important: false,
        value: '',
    },
    {
        title: 'Chirurgicaux',
        category: 'Antécédents traumas',
        important: false,
        value: '',
    },
    {
        title: 'Orthopédique',
        category: 'Systèmique',
        important: false,
        value: '',
    },
    {
        title: 'Tete',
        category: 'Systèmique',
        important: false,
        value: '',
    },
    {
        title: 'Thorax',
        category: 'Systèmique',
        important: false,
        value: '',
    },
    {
        title: 'Abdomen',
        category: 'Systèmique',
        important: false,
        value: '',
    },
    {
        title: 'Gynéco/uro',
        category: 'Systèmique',
        important: false,
        value: '',
    },
    {
        title: 'ORL',
        category: 'Systèmique',
        important: false,
        value: '',
    },
];