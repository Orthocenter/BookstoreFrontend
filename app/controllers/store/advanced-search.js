import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['all', 'orderBy'],

  offset: 0,
  limit: 5,

  actions: {
    search: function() {
      var conditions = this.get('conditions');
      var where = [];
      var self = this;

      for(var i = 0; i < conditions.get('length'); i++) {
        var condition = conditions[i];

        var term = condition.get('term');
        var cond = condition.get('cond');
        var conj = condition.get('OR') ? 'OR' : 'AND';

        where.push({term: term, cond: cond, conj: conj});
      }

      this.store.find('book', {
        advanced: JSON.stringify(where),
        orderBy: this.get('sortBy') + this.get('orderBy'),
        offset: this.get('offset'),
        limit: this.get('limit')
      }).then(function(result) {
        self.set('result', result);
      });

      this.set('displayResult', true);
    },

    sortByYr: function() {
      this.set('sortBy', 0);
      this.set('offset', 0);
    },

    sortByFb: function() {
      this.set('sortBy', 2);
      this.set('offset', 0);
    },

    sortByTFb: function() {
      this.set('sortBy', 4);
      this.set('offset', 0);
    },

    descent: function() {
      this.set('orderBy', 1);
      this.set('offset', 0);
    },

    ascent: function() {
      this.set('orderBy', 0);
      this.set('offset', 0);
    },

    or: function(index) {
      var conditions = this.get('conditions');
      var condition = conditions[index];
      var length = conditions.length;

      if(index === length - 1) return;
      condition.set('OR', true);
      condition.set('AND', false);
    },

    and: function(index) {
      var conditions = this.get('conditions');
      var condition = conditions[index];
      var length = conditions.length;

      if(index === length - 1) return;
      condition.set('OR', false);
      condition.set('AND', true);
    },

    insert: function(index) {
      var conditions = this.get('conditions');
      if(!conditions[index].get('OR') && !conditions[index].get('AND')) conditions[index].set('OR', true);
      conditions[index].set('disabled', false);
      conditions.insertAt(index + 1, Ember.Object.create({
        term: 'Title', cond: '',
        OR: index + 1 != conditions.get('length'),
        AND: false, disabled: index + 1 === conditions.get('length')
      }));
    },

    remove: function(index) {
      var conditions = this.get('conditions');
      if(conditions.get('length') > 1) conditions.removeAt(index);
    },

    term: function(condition, term) {
      condition.set('term', term);
    },

    goBack: function() {
      this.set('displayResult', false);
    }
  },

  sortBy: 0,
  sortByYr: true,
  orderBy: 1,
  descent: true,
  conditions: Ember.ArrayController.create().pushObject([Ember.Object.create({term: 'Title', cond: '', OR: false, AND: false, disabled: true})]),

  sortByChanged: Ember.observer('sortBy', function() {
    var sortBy = this.get('sortBy');
    this.set('sortByYr', sortBy === 0);
    this.set('sortByFb', sortBy === 2);
    this.set('sortByTFb', sortBy === 4);

    if(this.get('conditions')) this.send('search');
  }),

  orderByChanged: Ember.observer('orderBy', function() {
    var orderBy = this.get('orderBy');
    this.set('descent', orderBy === 1);
    this.set('ascent', orderBy === 0);

    if(this.get('conditions')) this.send('search');
  }),

  total: Ember.computed("result", {
    get: function() {
      return this.get('result.meta.total') || 0;
    }
  }),

  pagecount: Ember.computed("limit", "total", {
    get: function() {
      return Math.ceil(this.get('total') / this.get('limit'));
    }
  }),

  limitChanged: Ember.observer('limit', function() {
    this.send('search'); // if I send 'search' from pagination-limit, results are wrong
  })


});
