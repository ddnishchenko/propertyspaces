import * as fromProjectGallery from './project-gallery.actions';

describe('loadProjectGallerys', () => {
  it('should return an action', () => {
    expect(fromProjectGallery.loadProjectGallerys().type).toBe('[ProjectGallery] Load ProjectGallerys');
  });
});
