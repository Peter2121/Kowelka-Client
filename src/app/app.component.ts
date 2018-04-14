import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: "<table>\n\
                <tr>\n\
                    <td><ordername></ordername></td>\n\
                    <td><category></category></td>\n\
                    <td><product></product></td>\n\
                    <td><order></order></td>\n\
                </tr>\n\
                <tr><td colspan=4><message></message></td></tr>\n\
             </table>"
})
export class AppComponent {}
