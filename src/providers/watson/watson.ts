import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1';

// https://www.ibm.com/watson/developercloud/natural-language-understanding/api/v1/
// https://console.bluemix.net/docs/services/natural-language-understanding/getting-started.html#getting-started-tutorial
// https://console.bluemix.net/developer/watson/spaces/ca005d71-f663-4821-8b0b-cf1378d16788/projects/40d0780c-bfd5-4fb3-b0b6-15cc7fed3824
@Injectable()
export class WatsonProvider {
  private _naturalLanguageUnderstanding: NaturalLanguageUnderstandingV1;
  constructor(public http: Http) {
    this._naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      'username': '222991c0-816c-4587-b9d8-139218b750e2',
      'password': 'NlCZxcCM5BVP',
      'version_date': '2017-02-27'
    });
  }

  public analyze(param): any {

  }

}
