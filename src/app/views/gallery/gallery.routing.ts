import { Routes } from "@angular/router";
import { GalleryComponent } from "./gallery.component";

export const GalleryRoutes: Routes = [
  {
    path: "",
    component: GalleryComponent,
    data: { title: "Gallery", breadcrumb: "Gallery" }
  }
];
