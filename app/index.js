'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var baseNodeRequirements = [
  'connect-livereload',
  'load-grunt-tasks',
  'grunt',
  'grunt-contrib-connect',
  'grunt-contrib-jade',
  'grunt-contrib-watch',
  'juice',
  'grunt-juice-email',
  'grunt-open'
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

      done();
    }.bind(this));
  },

  folderScaffolding: {
    app: function() {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );

      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );

      this.fs.copy(
        this.templatePath('src/*'),
        this.destinationPath('src/*')
      );
    },
  },

  setup: function () {
    //bower
    this.bowerInstall(baseBowerRequirements, {'saveDev': true});

    //npm
    this.npmInstall(baseNodeRequirements, { 'saveDev': true });

    //install chosen precompiler
    if (this.preprocessor === 'sass') {
      this.npmInstall(['grunt-contrib-sass'], { 'saveDev': true });
    }else if( this.preprocessor === 'less'){
      this.npmInstall(['grunt-contrib-less'], { 'saveDev': true });
    }
  },


  inkConfig: function () {
    this.fs.copy(
      this.destinationRoot('/bower_components/ink/ink.css'),
      this.destinationRoot('')
    );
  }
});
