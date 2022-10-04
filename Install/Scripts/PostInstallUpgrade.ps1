﻿
$LastInstall = Get-PnPListItem -List "Installasjonslogg" -Query "<View><Query><OrderBy><FieldRef Name='Created' Ascending='False' /></OrderBy></Query></View>" | Select-Object -First 1 -Wait
if ($null -ne $LastInstall) {
    $PreviousVersion = $LastInstall.FieldValues["InstallVersion"]

    if ($PreviousVersion -lt "1.2.7") {
        Write-Host "[INFO] In version v1.2.7 we added 'Prosjekttidslinje' to the top navigation. Adding this navigation item now as part of the upgrade" 
        Add-PnPNavigationNode -Location TopNavigationBar -Title "Prosjekttidslinje" -Url "$($Uri.LocalPath)/SitePages/Prosjekttidslinje.aspx"
    }
    if ($PreviousVersion -lt "1.5.0") {
        Write-Host "[INFO] Applying PnP upgrade template [1.5.0] to [$Url]"
        Apply-PnPProvisioningTemplate "$BasePath\1.5.0.pnp" -ErrorAction Stop
        Write-Host "[SUCCESS] Successfully applied PnP template [1.5.0] to [$Url]" -ForegroundColor Green
    }
    if ($PreviousVersion -lt "1.6.0") {
        Write-Host "[INFO] In version v1.6.0 we added Project timeline configuration and reworked the TimelineContent list. Merging data now as part of the upgrade"

        $Items = Get-PnPListItem -List "Tidslinjeinnhold"
        $Milestone = [Uri]::UnescapeDataString("Milep%C3%A6l")
        foreach ($Item in $Items) {
            $OldSiteId = $Item.FieldValues["SiteIdLookup"].LookupId
            $OldType = $Item.FieldValues["TimelineType"]

            if($null -ne $OldSiteId) {
                $Item["GtSiteIdLookup"] = $OldSiteId
            }
            
            if($null -ne $OldType) {
                Switch ($OldType)
                {
                    "Prosjekt" { $Item["GtTimelineTypeLookup"] = 1 }
                    "Fase" { $Item["GtTimelineTypeLookup"] = 2 }
                    "Delfase" { $Item["GtTimelineTypeLookup"] = 3 }
                    $Milestone { $Item["GtTimelineTypeLookup"] = 4 }
                }
            }
            
            $Item.Update()
            Invoke-PnPQuery
        }

        Remove-PnPField -List "Tidslinjeinnhold" -Identity "SiteIdLookup" -Force -ErrorAction SilentlyContinue
        Remove-PnPField -List "Tidslinjeinnhold" -Identity "TimelineType" -Force -ErrorAction SilentlyContinue
        Invoke-PnPQuery
    }
    if ($PreviousVersion -lt "1.7.0") {
        Write-Host "[INFO] In version v1.7.0 we integrated idea processing and reworked the IdeaProcessing list. Merging data now as part of the upgrade"

        $IdeaProcessing = Get-PnPList -Identity "Idebehandling" -ErrorAction SilentlyContinue
        if ($null -ne $IdeaProcessing) {
            $Items = Get-PnPListItem -List "Idebehandling"
            foreach ($Item in $Items) {
                $GtIdeaExpectedGain = $Item.FieldValues["GtIdeaExpectedGain"]
                $GtIdeaExecutionResourceNeeds = $Item.FieldValues["GtIdeaExecutionResourceNeeds"]
                $GtIdeaExecutionSuccessFactors = $Item.FieldValues["GtIdeaExecutionSuccessFactors"]

                if ($null -ne $GtIdeaExpectedGain) {
                    $Item["GtIdeaExpectedGains"] = $GtIdeaExpectedGain
                }

                if ($null -ne $GtIdeaExecutionResourceNeeds) {
                    $Item["GtIdeaExecutionPlanResourceNeeds"] = $GtIdeaExecutionResourceNeeds
                }

                if ($null -ne $GtIdeaExecutionSuccessFactors) {
                    $Item["GtIdeaExecutionPlanSuccessFactors"] = $GtIdeaExecutionSuccessFactors
                }
                
                $Item.Update()
                Invoke-PnPQuery
            }
        }

        Remove-PnPField -List "Idebehandling" -Identity "GtIdeaExpectedGain" -Force -ErrorAction SilentlyContinue
        Remove-PnPField -List "Idebehandling" -Identity "GtIdeaExecutionResourceNeeds" -Force -ErrorAction SilentlyContinue
        Remove-PnPField -List "Idebehandling" -Identity "GtIdeaExecutionSuccessFactors" -Force -ErrorAction SilentlyContinue
        Invoke-PnPQuery
    }
}
