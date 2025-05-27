import { useEffect, useState } from "react";
import { ButtonElement, InputElement, InputType } from "../../types/form";
import { createInputElement } from "./ElementsPanel";

const templatesAvailable = [
  {
    id: 0,
    file: {},
    content:
      "<p><strong>Τι ειναι το οται?</strong></p><ul><li>ειναι μια βιβλιοθηκη για στατε μαναγεμεντ η οποια προσφερει μια απλη λυση σε αντιθεση με πιο πολυπλοκες βιβλιοθηκες οπως ειναι η ρεακτ.</li><li>Αξιοποιει ανεξαρτητες οντοτητες απο το στατε που τα αποκαλει ατομς προκειμενου να διαχειριστει το στατε.</li></ul><p><strong>παμε να δουμε μερικα απο τα features που εχει το οται</strong></p><ul><li>μινιμαλ κορε απι </li><li>μικρου μεγεθους μπαντλ 2κιλομπαιτς - το οποιο το καθιστα μπλοκινγκ για την επιδοση της εφαρμογης μας</li><li>ειναι ταιπσκριπτ οριεντιντ και ερχεται με τα ταιπινγκς προ εγκατεστημενα</li><li>συνεργαζεται και με αλλα frameworks οπως ειναι η νεξτ το γκατσμπι ρεμιξ και ριακτ νειτιβ</li></ul><p><strong>Βασικα κονσεπτς του οται</strong></p><p>οπως ειπαμε το οται εχει ενα πολυ μινιμαλ απι και απο το βασικο του μπαντλ μπορουμε να κανουμε μονο μερικα εξπορτς. Αυτα χωριζονται σε 4 κατηγοριες</p><ul><li>ατομ</li><li>θσεατομα</li><li>στορε</li><li>και προβαιντερ</li></ul><p><strong>Ατομ</strong></p><p>χρησιμοποιειται να δημιουργησουμε ενα ατομ κονφιγκ που παιρνει απλα ενα initialValue</p><p>Παρολα αυτα ομως μπορουμε να εχουμε και συμπληρωματικα ατομς </p><ul><li>read only </li><li>write only </li><li>read-write</li></ul><p>για να δημιουργησουμε τα derived ατομς περναμε σαν προπερτις ενα read function και ενα write function</p><p>τα read-write μπορουν να αλλαξουν επιςης την τιμη των atoms στα οποια βασιζονται μεσω του write function</p><p><strong>useAtom</strong></p><ul><li>ειναι ενα hook μεσω του οποιου μπορουμε να παρουμε την τιμη απο ενα atom</li><li>οπως βλεπουμε δηλωνεται σαν το γνωστο θσεΣτατε με ενα tuple που η πρωτη τιμη ειναι το value και η δευτερη ενα ενα function για την αλλαξουμε</li><li>οταν ενα ατομ δηλωνεται ο Provider δεν εχει καποια τιμη οποτε την πρωτη φορα που θα χρησιμοποιηθει απο το useAtom τοτε ο Provider παιρνει τιμη για αυτο το ατομ</li><li>Περα απο το useAtom εχουμε αλλες δυο συναρτησεις την <strong>useAtomValue </strong>που χρησιμοποιειται οταν θελουμε μονο να διαβασουμε την τιμη απο ενα ατομ και την <strong>setAtomValue </strong>οταν μας νιαζει να κανουμε απντειτ το στειτ ενος ατομ χωρις να το διαβασουμε</li></ul><p><strong>στορ</strong></p><p>το στορ εχει δυο φανκτιονς το κριειτστορ που ειναι για να δημιοθργησουμε ενα καινουριο στορ και να οτ περασουμε στον προβαιντερ και εχει 3 μεθοδους</p><p>getdefaultstore αυτη η function επιστρεφει το defaultstore valuε πριν δοθει σε εναν προβαιντερ</p><p><strong>Provider</strong>:</p><p>Ο προβαιντερ μασ παρεχει το στειτ για το κομπονεντ sub trees.</p><p>Μπορουμε να εχουμε πολλαπλους προβαιντερς σε πολλαπλα sub trees.</p><p>Οι προβαιντερς ειναι σημαντικοι για 3 λογους: </p><ol><li>οπως ηδη ειπαμε μεσω αυτων παρεχεται ενα στειτ για καθε sub tree.</li><li>οριζονται οι αρχικες τιμες για τα atoms</li><li>ειναι υπευθυνοι να κανουν unmount </li></ol><p>Jotai vs. Redux?</p><p>Jotai is very different from Redux and React Context API in almost every way. But there's one central concept that is the catch-all—the one that you need to internalize.</p><p>Redux stores are monolithic, but Jotai is atomic.</p><p>This means, in Redux, it's a pattern to store all the needed global state in the app in one single big object. In Jotai, it’s the opposite. You break your state into atoms i.e. - one store for one single store, or for a closely related state.</p>",
    fileName: "Τι ειναι το οται.docx",
    placeholders: [
      {
        id: "placeholder-1748343807459",
        name: "name",
        type: "text",
      },
      {
        id: "placeholder-1748343808360",
        name: "age",
        type: "number",
      },
      {
        id: "placeholder-1748343809326",
        name: "email",
        type: "email",
      },
    ],
  },
  {
    id: 1,
    file: {},
    content:
      "<p><strong>Τι ειναι το οται?</strong></p><ul><li>ειναι μια βιβλιοθηκη για στατε μαναγεμεντ η οποια προσφερει μια απλη λυση σε αντιθεση με πιο πολυπλοκες βιβλιοθηκες οπως ειναι η ρεακτ.</li><li>Αξιοποιει ανεξαρτητες οντοτητες απο το στατε που τα αποκαλει ατομς προκειμενου να διαχειριστει το στατε.</li></ul><p><strong>παμε να δουμε μερικα απο τα features που εχει το οται</strong></p><ul><li>μινιμαλ κορε απι </li><li>μικρου μεγεθους μπαντλ 2κιλομπαιτς - το οποιο το καθιστα μπλοκινγκ για την επιδοση της εφαρμογης μας</li><li>ειναι ταιπσκριπτ οριεντιντ και ερχεται με τα ταιπινγκς προ εγκατεστημενα</li><li>συνεργαζεται και με αλλα frameworks οπως ειναι η νεξτ το γκατσμπι ρεμιξ και ριακτ νειτιβ</li></ul><p><strong>Βασικα κονσεπτς του οται</strong></p><p>οπως ειπαμε το οται εχει ενα πολυ μινιμαλ απι και απο το βασικο του μπαντλ μπορουμε να κανουμε μονο μερικα εξπορτς. Αυτα χωριζονται σε 4 κατηγοριες</p><ul><li>ατομ</li><li>θσεατομα</li><li>στορε</li><li>και προβαιντερ</li></ul><p><strong>Ατομ</strong></p><p>χρησιμοποιειται να δημιουργησουμε ενα ατομ κονφιγκ που παιρνει απλα ενα initialValue</p><p>Παρολα αυτα ομως μπορουμε να εχουμε και συμπληρωματικα ατομς </p><ul><li>read only </li><li>write only </li><li>read-write</li></ul><p>για να δημιουργησουμε τα derived ατομς περναμε σαν προπερτις ενα read function και ενα write function</p><p>τα read-write μπορουν να αλλαξουν επιςης την τιμη των atoms στα οποια βασιζονται μεσω του write function</p><p><strong>useAtom</strong></p><ul><li>ειναι ενα hook μεσω του οποιου μπορουμε να παρουμε την τιμη απο ενα atom</li><li>οπως βλεπουμε δηλωνεται σαν το γνωστο θσεΣτατε με ενα tuple που η πρωτη τιμη ειναι το value και η δευτερη ενα ενα function για την αλλαξουμε</li><li>οταν ενα ατομ δηλωνεται ο Provider δεν εχει καποια τιμη οποτε την πρωτη φορα που θα χρησιμοποιηθει απο το useAtom τοτε ο Provider παιρνει τιμη για αυτο το ατομ</li><li>Περα απο το useAtom εχουμε αλλες δυο συναρτησεις την <strong>useAtomValue </strong>που χρησιμοποιειται οταν θελουμε μονο να διαβασουμε την τιμη απο ενα ατομ και την <strong>setAtomValue </strong>οταν μας νιαζει να κανουμε απντειτ το στειτ ενος ατομ χωρις να το διαβασουμε</li></ul><p><strong>στορ</strong></p><p>το στορ εχει δυο φανκτιονς το κριειτστορ που ειναι για να δημιοθργησουμε ενα καινουριο στορ και να οτ περασουμε στον προβαιντερ και εχει 3 μεθοδους</p><p>getdefaultstore αυτη η function επιστρεφει το defaultstore valuε πριν δοθει σε εναν προβαιντερ</p><p><strong>Provider</strong>:</p><p>Ο προβαιντερ μασ παρεχει το στειτ για το κομπονεντ sub trees.</p><p>Μπορουμε να εχουμε πολλαπλους προβαιντερς σε πολλαπλα sub trees.</p><p>Οι προβαιντερς ειναι σημαντικοι για 3 λογους: </p><ol><li>οπως ηδη ειπαμε μεσω αυτων παρεχεται ενα στειτ για καθε sub tree.</li><li>οριζονται οι αρχικες τιμες για τα atoms</li><li>ειναι υπευθυνοι να κανουν unmount </li></ol><p>Jotai vs. Redux?</p><p>Jotai is very different from Redux and React Context API in almost every way. But there's one central concept that is the catch-all—the one that you need to internalize.</p><p>Redux stores are monolithic, but Jotai is atomic.</p><p>This means, in Redux, it's a pattern to store all the needed global state in the app in one single big object. In Jotai, it’s the opposite. You break your state into atoms i.e. - one store for one single store, or for a closely related state.</p>",
    fileName: "Τι ειναι το οται2.docx",
    placeholders: [
      {
        id: "placeholder-1748343807459",
        name: "email",
        type: "text",
      },
      {
        id: "placeholder-1748343808360",
        name: "age",
        type: "number",
      },
      {
        id: "placeholder-1748343809326",
        name: "address",
        type: "email",
      },
    ],
  },
];

interface FormAssociationProps {
  onAddElement: (element: InputElement | ButtonElement) => void;
}

function FormAssociation({ onAddElement }: FormAssociationProps) {
  const [templateId, setTemplateId] = useState<string>("0");

  const handleTemplateSelect = (templateId: string) => {
    setTemplateId(templateId);
    const selectedTemplate = templatesAvailable.find(
      (template) => String(template.id) === templateId
    );
    if (selectedTemplate) {
      selectedTemplate.placeholders.map((placeholder) => {
        console.log(placeholder);
        onAddElement(createInputElement(placeholder.type as InputType));
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-medium text-gray-700">Form Association</h2>
      </div>

      {/* Input Elements Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Templates</h3>
        <select
          value={templateId}
          defaultValue={"none"}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
        >
          {templatesAvailable.map((template) => (
            <option key={template.id} value={template.id}>
              {template.fileName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FormAssociation;
