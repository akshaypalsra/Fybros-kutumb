package com.carvia.app;

import org.cdk8s.plus27.EnvValue;
import software.constructs.Construct;

import org.cdk8s.App;
import org.cdk8s.Chart;
import org.cdk8s.ChartProps;

public class Main extends Chart {

    public Main(final Construct scope, final String id, WebAppProps props) {
        this(scope, id, ChartProps.builder().build(), props);
    }

    public Main(final Construct scope, final String id, final ChartProps props, WebAppProps serviceProps) {
        super(scope, id, props);
        new WebApp(this, "webapp", serviceProps);
    }

    public static void main(String[] args) {
        try {
            final String env = (String) EnvValue.fromProcess("env").getValue();
            final WebAppProps props = ConfigLoader.loadWebProps(env);
            props.setImageVersion((String) EnvValue.fromProcess("version").getValue());
            final App app = new App();
            new Main(app, props.getApp().getId(), props);
            app.synth();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
