'use strict';
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');

var baseNodeRequirements = [
  'connect-livereload',
  'load-grunt-tasks',
  'grunt',
  'grunt-contrib-connect',
  'grunt-contrib-jade',
  'grunt-contrib-watch',
  'juice',
  'grunt-juice-email',
  'grunt-open',
  'grunt-bowercopy'
];
var baseBowerRequirements = [
  'ink'
];

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to ' + chalk.red('Juicr') + '. The email generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'campaign',
      message: 'What should we call this email campaign?',
      default: this.appName
    },
    // later give people the option to turn off preprocessing and templates
    // {
    //   type: 'checkbox',
    //   name: 'baseOptions',
    //   message: 'Please check the features you would like to use',
    //   choices: [
    //     'a templating language',
    //     'css preprocessing',
    //     'zurb ink base stylesheet'
    //   ]
    // }
    {
      type: 'list',
      name: 'preprocessor',
      message: 'What preprocessor would you like to use?',
      choices: [
        'sass',
        'less'
      ],
      default: 'sass'
    }
    ];

    this.prompt(prompts, function (props) {
      this.campaign     = props.campaign;
      this.preprocessor = props.preprocessor;

      if (this.preprocessor === 'sass') {
        this.preprocessorExtension = 'scss';
      }

      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { name: this.campaign}
      );

      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        { name: this.campaign}
      );

      this.fs.copyTpl(
        this.templatePath('src/_index.jade'),
        this.destinationPath('src/index.jade'),
        { title: this.campaign + ' email campaign'}
      );

      this.fs.copy(
        this.templatePath('src/_main.' + this.preprocessorExtension),
        this.destinationPath('src/main.' + this.preprocessorExtension)
      );

      this.fs.copy(
        this.templatePath('src/' + this.preprocessorExtension + '/__base.' + this.preprocessorExtension),
        this.destinationPath('src/'+ this.preprocessorExtension +'/_base.' + this.preprocessorExtension)
      );

      this.fs.copyTpl(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('Gruntfile.js'),
        { processor: this.preprocessor,
          processorExtension: this.preprocessorExtension}
      );
    }
  },

  setup: function () {

    //install chosen precompiler
    if (this.preprocessor === 'sass') {
      baseNodeRequirements.push('grunt-contrib-sass');
    }else if( this.preprocessor === 'less'){
      baseNodeRequirements.push('grunt-contrib-less');
    }

    //bower
    this.bowerInstall(baseBowerRequirements, {'saveDev': true});
    //npm
    this.npmInstall(baseNodeRequirements, { 'saveDev': true });
  }

});
