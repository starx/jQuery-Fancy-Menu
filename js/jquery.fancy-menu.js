/*
 * jQuery Fancy Menu  v@1.0
 * http://projects.mrnepal.com/jquery/fancy-menu/
 * https://github.com/starx/jQuery-Fancy-Menu
 *
 * Copyright 2012 Nabin Nepal ~ St@rx
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 2012-9-13
 */
(function($) {
	$.fn.fancyMenu = function(options){
		var settings = $.extend({
			'effects' : {
				'stair' : true,
				'transition' : true
			},
			'offset' : '1em',
			'mainColumn': 'auto',
			'mainColumnColor' : 'rgba(0,102,153,0.9)',
			'mainColumnShadow' : '0 0 10px 0px #666',
			'identifier' : {
				'containerClass' : 'fancyMenu',
				'columnClass' : 'column',
				'currentColumnClass' : "curCol"
			}
		}, options);
		
		//console.log(settings);
		$elContainer = this;
		$el = this.find("ul.columns");
		
		$el.addClass(settings.identifier.containerClass)
			.css('margin', settings.offset);
		$columns = $el.children("li");
                
                var columnsWidth = $columns.length >= 1 ? $columns.length == 1 ? 98 : 100 / (($columns.length - 1) + 1.5) : 0;
                var mainColumnWidth = $columns.length > 1 ? 1.5 * columnsWidth : 98;
			
		if(settings.mainColumn == 'auto') {
			$mainColumnIndex = Math.round(($columns.size())/2);
			$mainColumn = $columns.eq($mainColumnIndex-1);
		} else {
			$mainColumnIndex = settings.mainColumn;
			$mainColumn = $columns.eq($mainColumnIndex-1);
		}
		
		$curColumn = $("li."+settings.identifier.currentColumnClass, $el);
		$otherColumns = $("li:not(."+settings.identifier.currentColumnClass+")", $el);
		$allTitles = $("h2", $columns);

		$allAccordianTitles = $columns.find("ul.innerAccordian li h3");
		$allAccordianSections = $columns.find("ul.innerAccordian li div").hide();
		
		if(settings.effects.stair) {
			var adjustMargins = function($col) { 
				init = 5;                    
				$col.animate({marginTop: init+"%"});
				$col.nextAll().each(function(i) { $(this).animate({ marginTop: (init)+(5*(i+1))+"%" }); });
				$col.prevAll().each(function(i) { $(this).animate({ marginTop: (init)+(5*(i+1))+"%" }); });
			};
        } else { $columns.css('marginTop', '5%'); }
        
        //Transition
		if(settings.effects.transition) {
                    if($elContainer.find('.fancy-overlay').size() == 0) {
                        $elContainer.prepend($("<div>", { 
                            'class': 'fancy-overlay', 
                            'css': { 
                                height: $elContainer.outerHeight(),
                                width: $elContainer.outerWidth(),
                                display: 'block',
                                position: 'absolute',
                                zIndex: 0,
                                background: ''
                                //border: '1px #000 solid',
                                //margin: "-20px 0 0 -20px"
                            } 
                        }));	
                    }	
		}
		
		var animateColumns = function($parentColumn, $parentColumnColor) {						
			var $curColumn = $("li.curCol", $el);
                        
			// if not the first time
			if($curColumn.size()) {
                            if(!$parentColumn.hasClass("curCol")) { //If current column is already active then dont do anything
                                // In case the main image of the column is showing then slide this up					
                                //console.log($curColumn);
                                $('.expanding, li.curCol', $el).each(function() {

                                    $(".image", $(this)).slideUp();
                                    $curIndex = $(this).index()+1;
                                    $colorIndex = $curIndex > $mainColumnIndex ? (2*$mainColumnIndex)-$curIndex : $curIndex;
                                    var cValue = 255 - (($colorIndex - 1)*10);

                                    //resize previous column to normal size
                                    $(this).animate({
                                        width: columnsWidth+"%",
                                        backgroundColor: "rgba("+cValue+","+cValue+","+cValue+",0.8)",
                                        boxShadow: '0'
                                    }, 200, function() {
                                            //

                                    }); // finally remove the curent class indicator
                                });
                                animateMain($parentColumn, $parentColumnColor);
                            }	
			} else {
                            //if there are not current column then this is the first time it is being encountered					
                            animateMain($parentColumn, $parentColumnColor);
                            $(".image", $parentColumn).slideDown("slow", function() { 
                            });
			}
				
		};
                
		var animateMain = function($parentColumn, $columnColor) {
			// Adjust the margin
			if(!$columnColor) { $columnColor = settings.mainColumnColor; }
			if(settings.effects.stair) adjustMargins($parentColumn);
			// make the current column the large size and the change background color  also add the current col to the list
			$parentColumn.addClass('expanding').delay(0).animate({				    
					backgroundColor: $columnColor,
					width: mainColumnWidth+"%"
			}, function() { 
				$("."+settings.identifier.currentColumnClass).removeClass(settings.identifier.currentColumnClass);
				$parentColumn.addClass(settings.identifier.currentColumnClass).removeClass('expanding').animate({ boxShadow: settings.mainColumnShadow }, 'fast');
			});
		};
                
		return $(this).each(function() {
			
			$("ul.innerAccordian", $columns).on("click", "li h3", function() {
			   var list = $(this).parent("li");
			   if(list.hasClass('active')) {
				   list.removeClass("active").children("div").slideUp("slow");
				   list.closest(settings.identifier.columnClass).find(".image").slideDown().css("display", "block");
			   } else {
					$(".active").removeClass("active").children("div").slideUp("slow");
					var liParent = list.closest("."+settings.identifier.columnClass); //The parent Column
					
					liParent.find(".image").slideUp();
					$("div", list).slideDown();
					list.addClass("active");
					animateColumns(liParent);
			   } 
			});
                        
			$otherColumns.on("click", "h2", function() {
				//$(this).parent().find("ul.innerAccordian li:first-of-type").trigger('click');
				
				if(settings.effects.transition) {
					var img = $.trim($(this).closest("li").data('transition-img'));
					if(img !== '') {
						$elContainer.css('backgroundImage', 'url("' + img + '")');
						$elContainer.find('.fancy-overlay').stop(false, true).fadeOut(1000, function() {
							$elContainer.find('.fancy-overlay').css('backgroundImage', 'url("' + img + '")');
							$elContainer.find('.fancy-overlay').fadeIn(0);
						});	
					}	
						
					var color = $.trim($(this).closest("li").data('transition-color'));
					if(color !== '') {
						$elContainer.css({
								'backgroundColor': color,
								'backgroundImage': ''
						});
						
						$elContainer.find('.fancy-overlay').stop(false, true).fadeOut(1000, function() {
							$elContainer.find('.fancy-overlay').css({
								'backgroundColor': color,
								'backgroundImage': ''
							});
							$elContainer.find('.fancy-overlay').fadeIn(0);
						});								
					}
			
				}				
				$(this).parent().children(".image").slideDown("slow").css({"display":"block"});				
				$("div", $('.active')).slideUp();
				
				/* Column Color */
				var columnColor = $.trim($(this).closest("li").data('column-color'));
				if(columnColor !== '') {
					animateColumns($(this).parent(), columnColor);
				} else {						
					animateColumns($(this).parent());
				}
			});

			$el.show();
			$("h2", $mainColumn).trigger('click');                                        
		});
                
	};    

})(jQuery);
