plugins {
    java
    war
    id("com.github.node-gradle.node") version "3.0.1"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.primefaces:primefaces:13.0.0")
    implementation("jakarta.enterprise:jakarta.enterprise.cdi-api:3.0.0")
    implementation("jakarta.persistence:jakarta.persistence-api:3.0.0")
    implementation("jakarta.faces:jakarta.faces-api:4.0.1")
    implementation("jakarta.servlet:jakarta.servlet-api:5.0.0")
    implementation("org.glassfish:jakarta.faces:3.0.3")


    implementation("com.google.code.gson:gson:2.11.0")
    implementation("com.google.guava:guava:32.1.1-jre")

    implementation("org.eclipse.persistence:eclipselink:4.0.4")
    implementation("org.postgresql:postgresql:42.7.4")
    implementation("io.github.cdimascio:dotenv-java:3.0.2")
}

tasks.processResources {
    from(".env") {
        into("")
    }
}


node {
    version.set("18.0.0")   // Use the version of Node.js you prefer
    npmVersion.set("8.0.0") // npm version
    download.set(true)      // Automatically download Node.js and npm
}

tasks.register<Exec>("compileTypeScript") {
    group = "build"
    description = "Compile TypeScript into JavaScript"
    workingDir = file("${projectDir}")
    commandLine("pnpm", "run", "bundle")
}

tasks.named("build") {
    dependsOn("compileTypeScript")
}
