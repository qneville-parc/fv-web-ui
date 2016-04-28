import React from 'react';
import t from 'tcomb-form';
import WysiwygFactory from 'views/components/Editor/fields/wysiwyg';
import SelectSuggestFactory from 'views/components/Editor/fields/selectSuggest';
import SelectFactory from 'views/components/Editor/fields/select';
import MediaFactory from 'views/components/Editor/fields/media';

const i18nExt = {
  add: '+ Add New',
  down: '▼',
  remove: 'X',
  up: '▲',
  optional: '(optional)'
}

const configExt = {
  config: {
    // for each of lg md sm xs you can specify the columns width
    horizontal: {
      md: [3, 9],
      sm: [6, 6]
    }
  }
}

const DefinitionsLayout = function (locals) {
  return (
    <div className="table-responsive">
      <table className="table">
        <tbody>
        <tr>
          <td>{locals.inputs.language}</td>
          <td>{locals.inputs.translation}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

const options = {
  FVWord: {
    order: ['dc:title', 'fv-word:part_of_speech', 'fv-word:pronunciation', 'fv:definitions', 'fv:literal_translation', 'fv-word:related_phrases', 'fv-word:categories', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:reference', 'fv:source', 'fv:available_in_childrens_archive'],
    fields: {
      'dc:title': {
        label: 'Word'
       },
      'fv:definitions': {
        label: 'Definitions',
        item: {
          fields: {
            translation: {
              label: 'Translation'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word actually means.</i>
      },
      'fv:literal_translation': {
        label: 'Literal Translation',
        item: {
          fields: {
            translation: {
              label: 'Translation'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word translates to regradless of context.</i>
      },
      'fv-word:part_of_speech' : {
        label: 'Part of Speech',
        factory: SelectFactory,
        attrs: {
          directory: 'parts_of_speech'
        }
      },
      'fv-word:pronunciation' : {
        label: 'Pronunciation'
      },
      'fv-word:related_phrases' : {
        label: 'Related Phrases',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVPhrase'
        }
      },
      'fv-word:categories' : {
        label: 'Categories',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVCategory',
          attrs: {
            page_provider: {
              name: 'category_suggestion',
              folder: 'Categories'
            }
          }
        }
      },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: MediaFactory,
          type: 'FVAudio'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: MediaFactory,
          type: 'FVPicture'
        }
      },
      'fv:related_videos' : {
        label: 'Related Videos',
        item: {
          factory: MediaFactory,
          type: 'FVVideo'
        }
      },
      'fv:cultural_note' : {
        label: 'Cultural Notes'
      },
      'fv:reference': {
        label: 'Reference',
        help: <i>Origin of record (person, book, etc).</i>
      },
      'fv:source': {
        label: 'Source',
        help: <i>Contributor(s) who helped create this record.</i>,
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fv:available_in_childrens_archive': {
        label: 'Available in Children\'s Archive'
      }
    },
    i18n: i18nExt
  },
  FVPhrase: {
    order: ['dc:title', 'fv:definitions', 'fv-phrase:phrase_books', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:reference', 'fv:source', 'fv:available_in_childrens_archive'],
    fields: {
      'dc:title': {
        label: 'Phrase'
       },
      'fv:definitions': {
        label: 'Definitions',
        item: {
          fields: {
            translation: {
              label: 'Translation'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word actually means.</i>
      },
      'fv-phrase:phrase_books' : {
        label: 'Phrase Books',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVCategory',
          attrs: {
            page_provider: {
              name: 'phrasebook_suggestion',
              folder: 'Phrase Books'
            }
          }
        }
      },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: MediaFactory,
          type: 'FVAudio'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: MediaFactory,
          type: 'FVPicture'
        }
      },
      'fv:related_videos' : {
        label: 'Related Videos',
        item: {
          factory: MediaFactory,
          type: 'FVVideo'
        }
      },
      'fv:cultural_note' : {
        label: 'Cultural Notes'
      },
      'fv:reference': {
        label: 'Reference',
        help: <i>Origin of record (person, book, etc).</i>
      },
      'fv:source': {
        label: 'Source',
        help: <i>Contributor(s) who helped create this record.</i>,
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fv:available_in_childrens_archive': {
        label: 'Available in Children\'s Archive'
      }
    },
    i18n: i18nExt
  },
  FVPortal: {
    fields: {
      'fv-portal:about': {
        label: 'Portal Introduction',
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          placeholder: 'Enter portal description here'
        }
      },
      'fv-portal:greeting': {
        label: 'Portal Greeting'
      },
      'fv-portal:featured_audio' : {
        label: 'Featured Audio',
        factory: MediaFactory,
        type: 'FVAudio'
      },
      'fv-portal:featured_words' : {
        label: 'Featured Words',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVWord'
        }
      },
      'fv-portal:background_top_image' : {
        label: 'Background Image',
        factory: MediaFactory,
        type: 'FVPicture'
      },
      'fv-portal:logo' : {
        label: 'Logo',
        factory: MediaFactory,
        type: 'FVPicture'
      }
    },
    i18n: i18nExt
  },
  FVDialect: {
    fields: {
      'dc:title': {
        label: 'Dialect Name',
        type: 'text'
      },
      'dc:description': {
        label: 'About Dialect',
        type: 'textarea',
        factory: WysiwygFactory
      },
      'fvdialect:country': {
        label: 'Country',
        factory: SelectFactory,
        attrs: {
          directory: 'fv_countries'
        }
      },
      'fvdialect:contact_information': {
        label: 'Contact Information',
        type: 'textarea',
        factory: WysiwygFactory
      }
    },
    i18n: i18nExt
  }
};

export default options;

// Sample usage with tcomb
//const PortalOptions = selectn('FVPortal', options);