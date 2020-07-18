# Sentiment Analysis tramite un Naive-Bayes Classifier

L'obbiettivo del progetto è uno strumento di classificazione di testi in grado di essere addestrato attraverso un interfaccia web.
L’interfaccia del classificatore è organizzata in due aree:
(i) da un lato delle box con dei testi (dei tweet ad esempio)
(ii) dall’altro una lista di categorie che possono essere associate ad aree di testo (positivo, negativo, ambiente, finanziaria, etc).

Il prototipo potrà essere utilizzato in tre modalità:
- Addestramento semplice: l’utenze evidenzia aree di testo e le associa alle categorie; il classificatore acquisisce l’associazione come nuovo input per l’addestramento.
- Addestramento guidato: il classificatore propone l’associazione di una categoria ad una porzione di testo evidenziando il grado di affidabilità dell’associazione; l’utente può validare o modificare l’associazione; il classificatore acquisisce l’associazione come nuovo input per l’addestramento.
(qui mi immagino una maschera a tendina con diverse azioni e lucente che può modificare la scelta fatta dal classificatore)
- Classificazione automatica: il classificatore definisce l’associazione di una categoria ad una porzione di testo evidenziando il grado di affidabilità dell’associazione.

Questa libreria potrebbe fornire i metodi di base per la classificazione
https://github.com/ttezel/bayes
