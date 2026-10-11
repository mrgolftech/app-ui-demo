export type PageId = 'home' | 'raz' | 'phonics' | 'dub' | 'quiz';
export type Artwork = 'meadow' | 'forest' | 'bird' | 'pond' | 'ship' | 'village' | 'fox';
export interface Sentence { en: string; zh: string; art: Artwork }
export interface Word { word: string; sound: string; rest: string; zh: string; letters: string[]; art: Artwork }
export interface QuizItem { q: string; a: string; choices: string[]; art: Artwork }
