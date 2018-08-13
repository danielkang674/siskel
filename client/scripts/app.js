var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    var likeState = this.get('like');
    likeState = !likeState;
    this.set('like', likeState);
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    this.on('change:like', function() {this.sortByField(this.comparator);}, this);
  },
  defaults: {
    comparator: 'title'
  },

  comparator: 'title',

  sortByField: function(field) {
    // console.log('checking if ', this.comparator, '=== ', field )
    // console.log( 'type of field = ', typeof this.comparator);
    // if (this.comparator === field) {
    // this.sort(function (field) {
    //   console.log('fieldasdfasdfasdf');
    //   if (field === 'year' || field === 'rating') {
    //     return 1;
    //   } else {
    //     return -1;
    //   }
    // });
    // } else {
  this.comparator = field;
  this.sort(field);
  //   }
  //    //console.log ('reaching here');
   }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change:like', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
