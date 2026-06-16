$ = jQuery;

function initTableButtons() {
    $(".data-table-toggle").unbind("click").click(function() {
        if (!$(this).hasClass("active")) {
            $(".data-table-toggle.active, .data-table.active").removeClass("active");
            $(this).addClass("active");
            $(".data-table[data-table-id='"+$(this).data("show-table-id")+"']").addClass("active");
        }
    });
}

function initFormItems() {
    $("#ingredient-select").unbind("change").change(function() {
        $("form.ingredient-details").attr("action", "/feed-database/ingredient/"+$(this).val());
        return false;
    });

    $(".display-basis input").unbind("change").change(function() {
        console.log("something changed", $(this).val());
        if ($(this).val() == "as-fed") {
            var dmMean = $("#nut-dm_pct .mean").text();
            $("#dmpercent").val(dmMean).removeAttr("disabled");
        } else {
            $("#dmpercent").val("").attr("disabled", "disabled");
        }
    });

    $("#reset-filters").unbind("click").click(function() {
        window.location = window.location.pathname;
        return false;
    });

    $("#new-filter").unbind("click").click(function() {
        var currentActiveAmount = $(".advanced-filters .advanced-filter.active").length;
        $(".advanced-filters .advanced-filter:eq("+currentActiveAmount+")").addClass("active");
        updateFilterButton();
        return false;
    });

    $(".remove-filter").unbind("click").click(function() {
        $(this).parent().removeClass("active").appendTo($(".advanced-filters"));
        $(this).parent().find(".nutrient-filter").val("");
        $(this).parent().find(".nutrient-operator").val("");
        $(this).parent().find(".nutrient-value").val("");
        updateFilterButton();
        return false;
    });

    $("button.resources").unbind("click").click(function() {
        $(".data-table-toggle.active, .data-table.active").removeClass("active");
        $(".data-table[data-table-id='99'], .data-table-toggle[data-show-table-id='99'").addClass("active");
        return false;
    });

    function updateFilterButton() {
        var currentActiveAmount = $(".advanced-filters .advanced-filter.active").length;
        if (currentActiveAmount == 3) {
            $("#new-filter").addClass("tapped-out").attr("disabled", "disabled");
        } else if (currentActiveAmount == 0) {
            $(".advanced-filters .advanced-filter:eq(0)").addClass("active");
            $("#new-filter").removeClass("tapped-out").removeAttr("disabled");
        } else {
            $("#new-filter").removeClass("tapped-out").removeAttr("disabled");
        }
    }
}

function initFeedButtons() {
    $(".path-feed #block-bartik-local-actions").remove();
}

$(document).ready(function() {
    // initFormItems();
    // initTableButtons();
    // initFeedButtons();
});

$(window).on('load', function() {

});

$(window).resize(function() {

});

$(window).scroll(function() {

});