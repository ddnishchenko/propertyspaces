import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProjects from './projects.reducer';

export const selectProjectsState = createFeatureSelector<fromProjects.ProjectsState>(
  fromProjects.projectsFeatureKey
);

export const selectProjects = createSelector(selectProjectsState, state => state.projects);
export const selectProject = createSelector(selectProjectsState, state => state.project);
export const selectProjectPanoramas =
  createSelector(
    selectProject,
    state => {
      if (state?.panoramas?.length) {
        const panoramas = state.panoramas
          .slice()
          .map((p, index) => ({ ...p, order: +p.order, floor: +p.floor, index, transitionFrom: undefined }));

        const sortedFloors =
          panoramas
            .map(p => p.floor)
            .sort((a, b) => a - b);

        const floors = Array
          .from(new Set(sortedFloors))
          .map(
            floor => panoramas
              .filter(p => p.floor === floor)
              .sort((a, b) => +a.order - +b.order)
          )
          .reduce((prev, next) => prev.concat(next))
          .sort((a, b) => +a.index - +b.index)
          .map(
            (currentValue, index, arr) => {
              if (index > 0 && index < arr.length - 1) {
                const next = arr[index + 1];
                const prev = arr[index - 1];
                if (next.floor > currentValue.floor) {
                  return {
                    ...currentValue,
                    transitionFrom: next.floor
                  }
                }

                if (prev.floor < currentValue.floor) {
                  return {
                    ...currentValue,
                    transitionFrom: prev.floor
                  }
                }

              }
              return currentValue;
            }
          )
          .sort((a, b) => +a.floor - +b.floor);

        return floors;
      }
      return [];
    }
  );

export const selectProjectHdrPanoramasFloors = createSelector(selectProjectPanoramas, state => {
  let floorNames = state.map(p => p.floor);
  floorNames = Array.from(new Set(floorNames));
  const panoFloors = floorNames.map(f => state.filter(p => p.floor === f));
  const panoFloorsCoord = panoFloors.map(f => {
    let xArray = f.map(p => +p.x);
    let zArray = f.map(p => +p.z);

    let xMin = Math.min(...xArray);
    let xMax = Math.max(...xArray);

    let zMin = Math.min(...zArray);
    let zMax = Math.max(...zArray);

    if (xMin < 0) {
      xArray = f.map(p => Math.abs(xMin) + +p.x);
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    } else if (xMin > 0) {
      xArray = f.map(p => +p.x - Math.abs(xMin));
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    }

    if (zMin < 0) {
      zArray = f.map(p => Math.abs(zMin) + +p.z);
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    } else if (zMin > 0) {
      zArray = f.map(p => +p.z - Math.abs(zMin));
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    }

    const xSide = xMax - (xMin);
    const zSide = zMax - (zMin);

    const floorplanMap = f.map((p, i) => ({
      name: p.name,
      index: p.index,
      order: p.order,
      floor: p.floor,
      z: (zArray[i] / zSide) * 100,
      x: (xArray[i] / xSide) * 100
    }));
    return floorplanMap;
    // const size = 50;

    // const floorplanArea = (xSide * zSide) * size;
    // const width = (zSide  + (zMin*2)) * size;
    // const height = (xSide  + (zMin*2)) * size;
  });


  return {
    _t: Date.now(),
    panoFloorsCoord,
    panoFloors,
    floorNames,
    panos: state
  }
})
export const selectProjectPanoramaByName = (name: string) =>
  createSelector(selectProjectPanoramas, state => (state.find(p => p.name === name) || {}));
