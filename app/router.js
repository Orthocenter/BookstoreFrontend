import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('admin');

  this.route('admin', function() {
    this.route('books', function() {
      this.route('new');
      this.route('arrive');
      this.route('popular', function() {});
    });

    this.route('authors', function() {
      this.route('new');
      this.route('degree');
      this.route('popular');
    });

    this.route('publishers', function() {
      this.route('new');
      this.route('popular');
    });

    this.route('customers', function() {
      this.route('trusted');
      this.route('useful');
    });
  });

  this.route('store', { path: '/' } , function() {
    this.route('book', { path: '/books/:ISBN' });
  });
});

export default Router;
