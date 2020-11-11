import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Vector3 } from "three";


export interface Sweep {
    uuid: string;
    alignmentType: string;
    neighbors: string[];
    position: Vector3;
    rotation: Vector3;
    floor: number;
}

export interface ModelData {
    sid: string;
    sweeps: Sweep[];
    modelSupportsVr: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModelDataResolver implements Resolve<ModelData> {

  constructor(private http: HttpClient) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<ModelData> {
    const modelId = route.paramMap.get('id');
    return this.http.get<ModelData>(`./assets/models/${modelId}/data.json`);
  }
}
