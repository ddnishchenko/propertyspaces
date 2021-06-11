import * as fromProjectGallery from './project-gallery.reducer';
import { selectProjectGalleryState } from './project-gallery.selectors';

describe('ProjectGallery Selectors', () => {
  it('should select the feature state', () => {
    const result = selectProjectGalleryState({
      [fromProjectGallery.projectGalleryFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
