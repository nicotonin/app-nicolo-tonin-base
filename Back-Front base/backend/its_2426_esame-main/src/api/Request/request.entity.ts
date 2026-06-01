export interface RequestPermesso {
  id?: string;
  dataRichiesta: Date;
  dataInizio: Date;
  dataFine: Date;
  categoriaId: string;// FK CategoriaPermesso
  motivazione: string;
  stato: 'In attesa' | 'Approvato' | 'Rifiutato';
  utenteId: string;// FK utente richiedente
  utenteValutazioneId?: string;// FK responsabile che approva/rifiuta
  dataValutazione?: Date;// data approvazione/rifiuto
  createdAt?: Date;
  updatedAt?: Date;
}
