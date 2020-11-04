import { Pipe, PipeTransform } from "@angular/core";
import { Meet } from "../models/meet.model";

@Pipe({ name: "filterMeets" })
export class FilterMeetsPipe implements PipeTransform {
  transform(
    meets: Meet[],
    search: any
  ) {
    console.log(meets, search);
    let filteredMeets = meets.filter(meet => {
      if (meet.title.toLowerCase().includes(search)) {
        return meet;
      }
    });
    return filteredMeets;
    // return filteredMeets.filter( o => {
    //     Object.keys(o).some(k => o[k].toLowerCase().includes(searchString.toLowerCase()));
    // });
  }
}
