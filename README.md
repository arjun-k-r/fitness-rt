# Fit for Life
Fitness cross-platform web application implemented with Ionic

# Bugs
> add 'tools:replace="android:value"' to <meta-data> element at AndroidManifest.xml

Add this code at the end of `pltaforms/android/build.gradle`

    configurations.all {
    resolutionStrategy.eachDependency { DependencyResolveDetails details ->
        def requested = details.requested
        if (requested.group == 'com.android.support') {
            if (!requested.name.startsWith("multidex")) {
                details.useVersion '25.3.0'
            }
        }
    }
}