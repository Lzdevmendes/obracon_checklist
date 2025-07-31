# 🔥 Configuração do Firebase para Obracon Checklist

Este documento explica como configurar o Firebase para o sistema de checklist de veículos.

## 📋 Pré-requisitos

1. Conta no Google
2. Acesso ao [Firebase Console](https://console.firebase.google.com/)

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nome do projeto: `obracon-checklist` (ou nome de sua preferência)
4. Desabilite o Google Analytics (opcional para este projeto)
5. Clique em "Criar projeto"

### 2. Configurar Firestore Database

1. No painel lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione a localização mais próxima (ex: `southamerica-east1`)
5. Clique em "Concluído"

### 3. Configurar Storage

1. No painel lateral, clique em "Storage"
2. Clique em "Começar"
3. Aceite as regras padrão (modo de teste)
4. Selecione a mesma localização do Firestore
5. Clique em "Concluído"

### 4. Obter Configurações do Projeto

1. No painel lateral, clique no ícone de engrenagem ⚙️ e depois em "Configurações do projeto"
2. Role para baixo até "Seus aplicativos"
3. Clique no ícone `</>` (Web)
4. Nome do app: `obracon-checklist-web`
5. **NÃO** marque "Configurar também o Firebase Hosting"
6. Clique em "Registrar app"
7. **COPIE** as configurações que aparecem (algo como):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "obracon-checklist.firebaseapp.com",
  projectId: "obracon-checklist",
  storageBucket: "obracon-checklist.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### 5. Configurar o Projeto React

1. Abra o arquivo `src/firebase/config.js`
2. Substitua as configurações de exemplo pelas suas configurações reais:

```javascript
// Substitua estas configurações pelas suas
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-sender-id",
  appId: "seu-app-id"
};
```

### 6. Configurar Regras de Segurança (Desenvolvimento)

#### Firestore Rules
1. No Firebase Console, vá para "Firestore Database" > "Regras"
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita para todos (APENAS PARA DESENVOLVIMENTO)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Storage Rules
1. No Firebase Console, vá para "Storage" > "Regras"
2. Substitua as regras por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permite leitura e escrita para todos (APENAS PARA DESENVOLVIMENTO)
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE**: Essas regras são para desenvolvimento. Para produção, implemente autenticação e regras mais restritivas.

## 🧪 Testando a Configuração

1. Inicie o projeto: `npm start`
2. Faça login no sistema
3. Selecione um veículo e preencha um checklist
4. Tire uma foto e envie o checklist
5. Verifique no Firebase Console:
   - **Firestore**: Deve aparecer uma coleção `checklists` com os dados
   - **Storage**: Deve aparecer uma pasta `checklist-photos` com a imagem

## 📊 Estrutura dos Dados

### Firestore - Coleção `checklists`
```javascript
{
  vehicleId: 1,
  placa: "ABC-1234",
  dataHora: "2025-01-31T15:30:00",
  observacoes: "Tudo ok",
  itensVerificados: {
    carcaca: true,
    luzesGerais: true,
    pneus: false,
    cacamba: true,
    nivelGasolina: true
  },
  fotoURL: "https://firebasestorage.googleapis.com/...",
  timestamp: "2025-01-31T18:30:00.000Z",
  createdAt: "2025-01-31T18:30:00.000Z"
}
```

### Storage - Pasta `checklist-photos`
- Arquivos de imagem com nome: `timestamp_placa.jpg`
- Exemplo: `1706721000000_ABC-1234.jpg`

## 🔧 Funcionalidades Implementadas

✅ **Salvar Checklist**: Dados salvos no Firestore + foto no Storage
✅ **Listar Histórico**: Busca todos os checklists ordenados por data
✅ **Buscar por Placa**: Filtro de checklists por placa específica
✅ **Visualizar Detalhes**: Modal com todos os dados e foto do checklist
✅ **Interface Responsiva**: Funciona em desktop e mobile

## 🚨 Solução de Problemas

### Erro: "Firebase: Error (auth/configuration-not-found)"
- Verifique se as configurações no `config.js` estão corretas
- Certifique-se de que o projeto foi criado no Firebase Console

### Erro: "Missing or insufficient permissions"
- Verifique se as regras do Firestore e Storage estão configuradas corretamente
- Para desenvolvimento, use as regras permissivas mostradas acima

### Erro: "Storage bucket not found"
- Certifique-se de que o Storage foi ativado no Firebase Console
- Verifique se o `storageBucket` no config está correto

### Checklists não aparecem no histórico
- Verifique se os dados estão sendo salvos no Firestore Console
- Abra o Developer Tools do navegador e veja se há erros no console

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12) para erros JavaScript
2. Firebase Console para verificar se os dados estão sendo salvos
3. Regras de segurança do Firestore e Storage
4. Configurações no arquivo `config.js`

---

🎉 **Pronto!** Seu sistema de checklist agora está integrado com Firebase e pode armazenar dados permanentemente.