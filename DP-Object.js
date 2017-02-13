
var DPObject = function(id){
   this.id = id;
   this.children = [];
   this.box = new DPBox();
}

DPObject.prototype = {
	add: function (child) {
        this.children.push(child);
    },
    remove: function (child) {
        var length = this.children.length;
        for (var i = 0; i < length; i++) {
            if (this.children[i] === child) {
                this.children.splice(i, 1);
                return;
            }
        }
    },
    getChild: function (i) {
        return this.children[i];
    },
    hasChildren: function () {
        return this.children.length > 0;
    },
    send: function(data, to) {
        this.box.send(data, this, to);
    },
    receive: function(data, from) {
        this.process(data,from);
    },
    process : function(data,from){
      log.add(from.id + " to " + this.id + ": " + data);
    }
};

var DPBox = function(){
	var DpObjects = {};

	return {
 
        register: function(DpObj) {
            DpObjects[DpObj.id] = DpObj;
        },

        unregister : function(DpObj){
            DpObjects[DpObj.id] = null;
        },
 
        send: function(data, from, to) {
            if (to) {  
              if(DpObjects[to.id])                    // single data to another featured object
                to.receive(data, from);  
              //else
                //log.add(from.id + " : " + to.id + " is not in your box ");  
            } else {                       // broadcast data to all featured
                for (key in DpObjects) {  
                  if(DpObjects[key]){ 
                    if (DpObjects[key] !== from) {
                        DpObjects[key].receive(data, from);
                    }
                  }
                }
            }
        }
    };
}


var log = (function() {
    var log = "";
 
    return {
        add: function(data) { log += data + "\n"; },
        show: function() { console.log(log); log = ""; }
    }
})();


function useCase1() {
    var yoko = new DPObject("Yoko");
    var john = new DPObject("John");
    var paul = new DPObject("Paul");
    var ringo = new DPObject("Ringo");
    
    console.log("************************************************************");
    console.log("");
    console.log("            CHAT ROOM                                 "); 
    console.log("");
    console.log("************************************************************"); 
    
    yoko.box.register(john);
    yoko.box.register(paul);
    paul.box.register(yoko);
    paul.box.register(ringo);
    
    var msg = "All you need is love.";
    yoko.send(msg);
    paul.send("Ha, I heard that!");
    paul.box.unregister(yoko);
    paul.send("yoko is unregistered!");   
    paul.send("you are unregistered" , yoko); 
    paul.box.register(yoko);
    paul.send("register yoko!");
   
    log.show();
}

function useCase2(){
    var papa = new DPObject("papa");
    var maman = new DPObject("maman");
    var steven = new DPObject("steven");


    console.log("************************************************************");
    console.log("");
    console.log("            FAMILY LIFE                                "); 
    console.log("");
    console.log("************************************************************"); 

    papa.add(maman);
    papa.add(steven);
    maman.add(steven);

    papa.box.register(steven);
    papa.box.register(maman);
    maman.box.register(steven);
    steven.box.register(papa);
    steven.box.register(maman);

    steven.send("y a des frites ?",maman);
    maman.send("non il y en a plus , il faut en acheter",steven);
    maman.send("tu peux aller acheter des frites ?",papa);
    papa.send("j'y vais");

    log.show();
}

function useCase3(){
    var Direction = new DPObject("Direction");
    var AssistantDir = new DPObject("AssistantDir");
    var Financial = new DPObject("Financial");
    var FinDir = new DPObject("FinancialDirection");
    var FinTech = new DPObject("FinancialTechnics");
    var Commercial = new DPObject("Commercial");
    var CommDir = new DPObject("CommercialDirection");
    var CommTech = new DPObject("CommercialTechnics");
    var Project = new DPObject("Project");
    var ProjectDir = new DPObject("ProjectDirection");
    var ProjectReal = new DPObject("ProjectRealisation");

    // Organigram Definition
    Direction.add(AssistantDir);
    Direction.add(Financial);
    Direction.add(Commercial);
    Direction.add(Project);

    Financial.add(FinDir);
    Financial.add(FinTech);

    Commercial.add(CommDir);
    Commercial.add(CommTech);

    Project.add(ProjectDir);
    Project.add(ProjectReal);

    // ------------ Communication Definition --------------------
    // Direction Communication
    Direction.box.register(AssistantDir);
    Direction.box.register(Financial);
    Direction.box.register(FinDir);
    Direction.box.register(Commercial);
    Direction.box.register(CommDir);
    Direction.box.register(Project);
    Direction.box.register(ProjectDir);

    // Financial Communication
    // Users et Financial general data
    Financial.box.register(Direction);
    Financial.box.register(FinDir);
    Financial.box.register(FinTech);

    // FinDir Communication
    // Users end FinDir data
    FinDir.box.register(Direction);
    FinDir.box.register(Financial);
    FinDir.box.register(FinTech);

    // FinTEch Communication
    // Users and FinTech data
    FinTech.box.register(Financial);
    FinTech.box.register(FinDir);

    // Commercial Communication
    // Users and Commercial general data
    Commercial.box.register(Direction);
    Commercial.box.register(CommDir);
    Commercial.box.register(CommTech);

    // CommDir Communication
    CommDir.box.register(Direction);
    CommDir.box.register(Commercial);
    CommDir.box.register(CommTech);

    // CommTech Communication
    CommTech.box.register(Commercial);
    CommTech.box.register(CommDir);

    // Project Communication
    // Users and Project general data
    Project.box.register(Direction);
    Project.box.register(ProjectDir);
    Project.box.register(ProjectReal);

    // ProjectDir Communication
    ProjectDir.box.register(Direction);
    ProjectDir.box.register(Project);
    ProjectDir.box.register(ProjectReal);

    // ProjectReal Communication
    ProjectReal.box.register(Project);
    ProjectReal.box.register(ProjectDir);

    //-------------- Data Definition -------------
    // Direction data Definition
    var Direction_General_Data = {
    	projectIndic : "project indicator",
    	financialIndic : "Financial indicator",
    	commercialIndic : "Commercial Indicator"
    };

    var DirectionToFinancial_Data = {
        financialDirective1:"financial directive 1",
        financialDirective2:"financial directive 2"
    };

    var DirectionToCommercial_Data = {
        commercialDirective1:"commercial directive 1",
        commercialDirective2:"commercial directive 2"
    };

    var DirectionToAssistant_Data = {
        DocumentDirective1:"document directive 1",
        DocumentDirective2:"document directive 2"
    };

    var DirectionToProject_Data = {
        ProjectDirective1:"project directive 1",
        ProjectDirective2:"project directive 2"
    };

    var DirectionToFinDir_Data = {
        FinDirDirective1 : "Directive to Financiel dir 1",
        FinDirDirective2 : "Directive to Financiel dir 2"
    };

    var DirectionToCommDir_Data = {
        CommDirDirective1 : "Directive to Commercial dir 1",
        CommDirDirective2 : "Directive to Commercial dir 2"
    };

    var DirectionToProjectDir_Data = {
        ProjectDirDirective1 : "Directive to Project dir 1",
        ProjectDirDirective2 : "Directive to Project dir 2"
    };

    // Financial data Definition
    var FinancialToDirection_Data = {
    	FinancialIndicator1 : "Financial indicator 1",
    	FinancialIndicator2 : "Financial indicator 2"
    };

    var FinancialToFinDir_Data = {
    	FinDirIndicator1 : "Financial indic for fin. direction 1",
    	FinDirIndicator2 : "Financial indic for fin. direction 2"
    };

    var FinancialToFinTech_Data = {
    	FinTechIndicator1 : "Financial indic for fin. Technician 1",
    	FinTechIndicator2 : "Financial indic for fin. Technician 2"
    };

    // Financial Dir data Definition
    var FinDirToDirection_Data = {
    	FinDirIndicator1 : "Financial indic. for direction 1",
    	FinDirIndicator2 : "Financial indic. for direction 2"
    };

    var FinDirToFinancial_Data = {
    	FinDirRepo1 : "Financial indic. repository for entity 1",
    	FinDirRepo2 : "Financial indic. repository for entity 2"
    };

    var FinDirToFinTech_Data = {
    	FinDirDirective1 : "Financial Directive repository for financial technician 1",
    	FinDirDirective2 : "Financial Directive repository for financial technician 2"
    };

    // Financial Tech data Definition
    var FinTechToFinancial_Data = {
    	FinTechRepo1 : "Financial indic. repository for entity 1",
    	FinTechRepo2 : "Financial indic. repository for entity 2"
    };

    var FinTechToFinDir_Data = {
    	FinTechWork1 : "Financial Work technical data repository for financial Direction 1",
    	FinTechWork2 : "Financial Work technical data repository for financial Direction 2"
    };  


    // Commercial data Definition
    var CommercialToDirection_Data = {
    	CommercialIndicator1 : "Commercial indicator 1",
    	CommercialIndicator2 : "Commercial indicator 2"
    };

    var CommercialToCommDir_Data = {
    	CommDirIndicator1 : "Commercial indicator for comm. dir 1",
    	CommDirIndicator2 : "Commercial indicator for comm dir 2"
    };

    var CommercialToCommTech_Data = {
    	CommTechIndicator1 : "Commercial indicator for comm. technician 1",
    	CommTechIndicator2 : "Commercial indicator for comm technician 2"
    };

    // Commercial Dir Data Definition
    var CommDirToDirection_Data = {
    	CommDirIndicator1 : "commercial indicator for direction 1",
    	CommDirIndicator2 : "commercial indicator for direction 2"
    };

    var CommDirToCommercial_Data = {
    	CommDirRepo1 : "Commercial indic. repository for entity 1",
    	CommDirRepo2 : "Commercial indic. repository for entity 2"
    };

    var CommDirToCommTech_Data = {
    	CommDirDirective1 : "Commercial Directive repository for technician 1",
    	CommDirDirective2 : "Commercial Directive repository for technician 2"
    };  


    // Commercial Tech data Definition
    var CommTechToCommercial_Data = {
    	CommTechRepo1 : "Commercial indic. repository for entity 1",
    	CommTechRepo2 : "Commercial indic. repository for entity 2"
    };

    var CommTechToCommDir_Data = {
    	CommTechWork1 : "Commercial Work technical data repository for Commercial Direction 1",
    	CommTechWork2 : "Commercial Work technical data repository for Commercial Direction 2"
    };

    // Project data Definition
    var ProjectToDirection_Data = {
    	ProjectIndicator1 : "Project indicator 1",
    	ProjectIndicator2 : "Project indicator 2"
    };

    var ProjectToProjectDir_Data = {
    	ProjectDirIndicator1 : "Project indicator 1 for project dir. 1",
    	ProjectDirIndicator2 : "Project indicator 2 for project dir. 2"
    };

    var ProjectToProjectTech_Data = {
    	ProjectTechIndicator1 : "Project indicator 1 for project tech. 1",
    	ProjectTechIndicator2 : "Project indicator 2 for project tech. 2"
    };   

    // Project Dir Data definition
    var ProjectDirToDirection_Data = {
    	ProjectDirIndicator1 : "Project dir. indicator for direction 1",
    	ProjectDirIndicator2 : "Project Dir. indicator for direction 2"
    };

    var ProjectDirToProject_Data = {
    	ProjectDirRepo1 : "Project indic. repository for entity 1",
    	ProjectDirRepo2 : "Project indic. repository for entity 2"
    };

    var ProjectDirToProjectReal_Data = {
    	ProjectDirDirective1 : "Project Directive repository for technician 1",
    	ProjectDirDirective2 : "Project  Directive repository for technician 2"
    };   

    // ProjectReal Data Definition
    var ProjectRealToProject_Data = {
    	ProjectRealRepo1 : "Project indic. repository for entity 1",
    	ProjectRealRepo2 : "Project indic. repository for entity 2"
    };

    var ProjectToProjectDir_Data = {
    	ProjectRealWork1 : "Project Work technical data repository for Project Direction 1",
    	ProjectRealWork2 : "Project Work technical data repository for Project Direction 2"
    };

    // Dialogue 1
    CommTech.send(CommTechToCommDir_Data.CommTechWork1,CommDir);
    CommDir.send(CommDirToDirection_Data.CommDirIndicator1,Direction);
    Direction.send(DirectionToProject_Data.ProjectDirective1,ProjectDir);
    ProjectDir.send(ProjectDirToProjectReal_Data.ProjectDirDirective1,ProjectReal);

    log.show();
}
useCase2();