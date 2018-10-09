import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsLocaleService} from 'ngx-bootstrap';
import {AntecedentCategory} from "./patient-antecedent/patient-antecedent.component";
import {Patient, Sexe} from "../patient.model";

@Component({
  selector: 'ngx-patient-view',
  styleUrls: ['./patient-view.component.scss'],
  templateUrl: './patient-view.component.html',
})
export class PatientViewComponent implements OnInit, OnDestroy {
  id: number;
  bsValue: Date;
  private patient: Patient = new Patient();
  private sexe = Sexe;
  private sexeValues = Object.values(this.sexe);
  private sub: any;

  private antecedentCategories: AntecedentCategory[];
  constructor(private route: ActivatedRoute, private localeService: BsLocaleService) {
    this.localeService.use('fr');

    this.antecedentCategories = [
      {
        title: 'Actuellement',
        antecedents: [
          {
            title: 'Médecine',
            important: false,
            value: '',
          },
          {
            title: 'Psychologie',
            important: false,
            value: '',
          },
          {
            title: 'Traitement médical',
            important: false,
            value: '',
          }
        ]
      }, {
        title: 'Antécédents traumas',
        antecedents: [
          {
            title: 'Entorse',
            important: false,
            value: '',
          },
          {
            title: 'Fracture',
            important: false,
            value: '',
          },
          {
            title: 'Luxation',
            important: false,
            value: '',
          },
          {
            title: 'Accident voiture',
            important: false,
            value: '',
          },
          {
            title: 'AVP',
            important: false,
            value: '',
          },
          {
            title: 'Chutes',
            important: false,
            value: '',
          },
          {
            title: 'Autres',
            important: false,
            value: '',
          }
        ]
      }, {
        title: 'Antécédents familiaux',
        antecedents: [
          {
            title: 'Décès',
            important: false,
            value: '',
          },
          {
            title: 'Accouchements',
            important: false,
            value: '',
          },
          {
            title: 'Autre',
            important: false,
            value: '',
          }
        ]
      }, {
        title: 'Antécédents médicaux',
        antecedents: [
          {
            title: 'TTT longue durée',
            important: false,
            value: '',
          },
          {
            title: 'TTT ponctuel',
            important: false,
            value: '',
          },
          {
            title: 'Autres',
            important: false,
            value: '',
          }
        ]
      }, {
        title: 'Antécédents chirurgicaux',
        antecedents: [
          {
            title: 'Orthopédique',
            important: false,
            value: '',
          },
          {
            title: 'Tete',
            important: false,
            value: '',
          },
          {
            title: 'Thorax',
            important: false,
            value: '',
          },
          {
            title: 'Abdomen',
            important: false,
            value: '',
          },
          {
            title: 'Gynéco/uro',
            important: false,
            value: '',
          },
          {
            title: 'ORL',
            important: false,
            value: '',
          }
        ]
      },
    ];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getNumberOfAntecedents() {
    let numberOfFilledAntecedents = 0;
    this.antecedentCategories.forEach(antecedentCategory => {
      antecedentCategory.antecedents.forEach(antecedent => {
        if (antecedent.value !== '') {
          numberOfFilledAntecedents++;
        }
      })
    });

    return numberOfFilledAntecedents + '';
  }

  getAge() {
    if (this.patient.birthdate){
      const timeDiff = Math.abs(Date.now() - this.patient.birthdate.getTime());
      // Used Math.floor instead of Math.ceil
      // so 26 years and 140 days would be considered as 26, not 27.
      return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      return '';
    }
  }

}
