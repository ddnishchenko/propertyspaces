import { createFeatureSelector, createSelector } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromProjects from './projects.reducer';

export const selectProjectsState = createFeatureSelector<fromProjects.ProjectsState>(
  fromProjects.projectsFeatureKey
);

export const selectProjects = createSelector(selectProjectsState, state => state.projects);
export const selectProjectById = (id: string) => createSelector(selectProjects, projects => projects.find(p => p.id === id));
export const selectVirtualTourParams = createSelector(
  selectProjectsState,
  state => ({
    ...state.virtualTourParameters,
    hostname: environment.apiHost,
    projectFolder: environment.apiHost + state.virtualTourParameters.path
  })
);
export const selectVirtualTourPanoramas =
  createSelector(
    selectVirtualTourParams,
    state => {
      if (state?.data?.length) {
        const panoramas = state.data
          .slice()
          .map((p, index) => ({ ...p, panoramas: { ...p.panoramas, order: +p.panoramas.order, floor: +p.panoramas.floor, index, transitionFrom: undefined } }));

        const sortedFloors =
          panoramas
            .map(p => p.panoramas.floor)
            .sort((a, b) => a - b);

        const floors = Array
        .from(new Set(sortedFloors))
        .map(
          floor => panoramas
            .filter(p => p.panoramas.floor === floor)
            .sort((a,b) => +a.panoramas.order - +b.panoramas.order)
        )
        .reduce((prev, next) => prev.concat(next))
        .sort((a,b) => +a.panoramas.index - +b.panoramas.index)
        .map(
            (currentValue, index, arr) => {
              if (index > 0 && index < arr.length - 1) {
                const next = arr[index + 1];
                const prev = arr[index - 1];
                if (next.panoramas.floor > currentValue.panoramas.floor) {
                  return {
                    ...currentValue,
                    panoramas: {
                      ...currentValue.panoramas,
                      transitionFrom: next.panoramas.floor
                    }
                  }
                }

                if (prev.panoramas.floor < currentValue.panoramas.floor) {
                  return {
                    ...currentValue,
                    panoramas: {
                      ...currentValue.panoramas,
                      transitionFrom: prev.panoramas.floor
                    }
                  }
                }

              }
              return currentValue;
            }
          )
          .sort((a,b) => +a.panoramas.floor - +b.panoramas.floor)
        ;
        console.log(floors.map(p => p.panoramas).map(({floor, order, transitionFrom}) => ({floor, order, transitionFrom}))  );
        return floors;
      }
      return [];
    }
  );
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

    const floorplanMap = f.map((p, i) => ({
      name: p.name,
      index: p.panoramas.index,
      order: p.panoramas.order,
      floor: p.panoramas.floor,
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
    _t: Date.now(),
    panoFloorsCoord,
    panoFloors,
    floors,
    panos: state
  }
})
export const selectVirtualTourPanoramaByName = (name: string) =>
  createSelector(selectHdrVirtualTourPanoramas, state => (state.find(p => p.name === name) || {}));

export const selectPanoForm = createSelector(selectProjectsState, state => state.panoEditForm);
export const selectPanoFormMode = createSelector(selectProjectsState, state => state.panoEditForm);
