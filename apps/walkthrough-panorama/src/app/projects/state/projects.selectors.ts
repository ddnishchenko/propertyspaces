import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProjects from './projects.reducer';

export const selectProjectsState = createFeatureSelector<fromProjects.ProjectsState>(
  fromProjects.projectsFeatureKey
);

export const selectProjects = createSelector(selectProjectsState, state => state.projects);
export const selectProjectById = (id: string) => createSelector(selectProjects, projects => projects.find(p => p.id === id));
export const selectVirtualTourParams = createSelector(selectProjectsState, state => state.virtualTourParameters);
export const selectVirtualTourPanoramas = createSelector(selectVirtualTourParams, state => state?.data || []);
export const selectHdrVirtualTourPanoramas = createSelector(selectVirtualTourPanoramas, state => {
  const panos = state.filter(t => !t.name.includes('_'));
  return panos.map(p => {
    return {
        ...p,
        dark_pano: state.find(t => t.name.includes(`${p.name}_dark`)),
        light_pano: state.find(t => t.name.includes(`${p.name}_light`)),
        hdr_pano: state.find(t => t.name.includes(`${p.name}_hdr`)),
    };
  });
});
export const selectHdrVirtualTourPanoramasDividerOnFloors = createSelector(selectHdrVirtualTourPanoramas, state => {
  let floors = state.map(p => p.panoramas.floor);
  floors = Array.from(new Set(floors));
  const panoFloors = floors.map(f => state.filter(p => p.panoramas.floor === f));
  const panoFloorsCoord = panoFloors.map(f => {
    let xArray = f.map(p => +p.panoramas.x);
    let zArray = f.map(p => +p.panoramas.z);

    let xMin = Math.min(...xArray);
    let xMax = Math.max(...xArray);

    let zMin = Math.min(...zArray);
    let zMax = Math.max(...zArray);

    if (xMin < 0) {
      xArray = f.map(p => Math.abs(xMin) + +p.panoramas.x);
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    } else if (xMin > 0) {
      xArray = f.map(p => +p.panoramas.x - Math.abs(xMin));
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    }

    if (zMin < 0) {
      zArray = f.map(p => Math.abs(zMin) + +p.panoramas.z);
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    } else if (zMin > 0) {
      zArray = f.map(p => +p.panoramas.z - Math.abs(zMin));
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    }

    const xSide = xMax - (xMin);
    const zSide = zMax - (zMin);

    const floorplanMap = f.map((p,i) => ({
      name: p.name,
      z: (zArray[i] / zSide) * 100,
      x: (xArray[i] / xSide) * 100
    }));
    return floorplanMap;
    // const size = 50;

    // const floorplanArea = (xSide * zSide) * size;
    // const width = (zSide  + (zMin*2)) * size;
    // const height = (xSide  + (zMin*2)) * size;
    // console.log(floorplanMap);
  });


  return {
    panoFloorsCoord,
    panoFloors,
    floors,
  }
})
export const selectVirtualTourPanoramaByName = (name: string) =>
  createSelector(selectHdrVirtualTourPanoramas, state => (state.find(p => p.name === name) || {}));

export const selectPanoForm = createSelector(selectProjectsState, state => state.panoEditForm);
export const selectPanoFormMode = createSelector(selectProjectsState, state => state.panoEditForm);
