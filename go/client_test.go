package nativebpm

import (
	"archive/zip"
	"bytes"
	"compress/gzip"
	"context"
	"os"
	"strings"
	"testing"

	"github.com/andybalholm/brotli"
)

func TestWorkflowBuilderAndWasm(t *testing.T) {
	ctx := context.Background()

	wf := NewWorkflow("test-process", "Test Process")
	wf.StartEvent("start").
		Next("service1").
		Builder().
		ServiceTask("service1", "Service 1", "topic1").
		Wasm("./my_wasm_module.wasm").
		Next("end").
		Builder().
		EndEvent("end", "End")

	xml, err := wf.BuildXML(ctx)
	if err != nil {
		t.Fatalf("failed to build XML: %v", err)
	}

	if !strings.Contains(xml, `id="test-process"`) {
		t.Errorf("expected process ID in XML, got: %s", xml)
	}

	if !strings.Contains(xml, `topic="topic1"`) {
		t.Errorf("expected topic in XML, got: %s", xml)
	}

	if !strings.Contains(xml, `wasmPath="./my_wasm_module.wasm"`) {
		t.Errorf("expected wasmPath in XML, got: %s", xml)
	}
}

func TestBuildXMLWithCompressedFormats(t *testing.T) {
	ctx := context.Background()

	wf := NewWorkflow("test-compressed", "Test Compressed")
	wf.StartEvent("start").Next("end")
	wf.EndEvent("end", "End")

	// 1. Create compressed files in-memory
	// Brotli
	var brBuf bytes.Buffer
	bw := brotli.NewWriter(&brBuf)
	_, _ = bw.Write(coreWasm)
	bw.Close()

	brFile, err := os.CreateTemp("", "core_*.wasm.br")
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(brFile.Name())
	_, _ = brFile.Write(brBuf.Bytes())
	brFile.Close()

	// Gzip
	var gzBuf bytes.Buffer
	gw := gzip.NewWriter(&gzBuf)
	_, _ = gw.Write(coreWasm)
	gw.Close()

	gzFile, err := os.CreateTemp("", "core_*.wasm.gz")
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(gzFile.Name())
	_, _ = gzFile.Write(gzBuf.Bytes())
	gzFile.Close()

	// Zip
	var zipBuf bytes.Buffer
	zw := zip.NewWriter(&zipBuf)
	zf, _ := zw.Create("subfolder/core.wasm")
	_, _ = zf.Write(coreWasm)
	zw.Close()

	zipFile, err := os.CreateTemp("", "core_*.wasm.zip")
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(zipFile.Name())
	_, _ = zipFile.Write(zipBuf.Bytes())
	zipFile.Close()

	// 2. Test BuildXMLWithPath for each format
	formats := []struct {
		name string
		path string
	}{
		{"Brotli", brFile.Name()},
		{"Gzip", gzFile.Name()},
		{"Zip", zipFile.Name()},
	}

	for _, tc := range formats {
		t.Run(tc.name, func(t *testing.T) {
			xml, err := wf.BuildXMLWithPath(ctx, tc.path)
			if err != nil {
				t.Fatalf("failed to compile using %s at %s: %v", tc.name, tc.path, err)
			}
			if !strings.Contains(xml, `id="test-compressed"`) {
				t.Errorf("expected process ID in XML, got: %s", xml)
			}
		})
	}
}

func TestBuildXMLWithPrecompile(t *testing.T) {
	ctx := context.Background()

	wf := NewWorkflow("precompile-test", "Precompile Test")
	wf.StartEvent("start").Next("end")
	wf.EndEvent("end", "End")

	// Pre-compile compiler using WithCompilerBytes
	_, err := wf.WithCompilerBytes(ctx, coreWasm)
	if err != nil {
		t.Fatalf("failed to precompile: %v", err)
	}
	defer wf.Close(ctx)

	// Call BuildXML (should run instantly using precompiled module)
	xml, err := wf.BuildXML(ctx)
	if err != nil {
		t.Fatalf("failed to build: %v", err)
	}
	if !strings.Contains(xml, `id="precompile-test"`) {
		t.Errorf("expected process ID in XML, got: %s", xml)
	}
}

func TestBusinessRuleTask(t *testing.T) {
	ctx := context.Background()
	wf := NewWorkflow("dmn-test", "DMN Test Process")

	wf.StartEvent("start").Next("ruleTask")

	wf.BusinessRuleTask("ruleTask", "Determine Discount", "determine_discount").
		HitPolicy("UNIQUE").
		Input("membership", "string").
		Input("age", "number").
		Output("discount", "number").
		Rule().
			When("membership", "gold").
			When("age", ">= 18").
			Then("discount", 20.0).
		Rule().
			When("membership", "silver").
			Then("discount", 10.0).
		ResultVariable("discountVar").
		MapDecisionResult("singleEntry").
		Next("end")

	wf.EndEvent("end", "End")

	xml, err := wf.BuildXML(ctx)
	if err != nil {
		t.Fatalf("failed to build: %v", err)
	}

	if !strings.Contains(xml, `businessRuleTask id="ruleTask"`) {
		t.Errorf("expected businessRuleTask in XML, got: %s", xml)
	}
	if !strings.Contains(xml, `decisionRef="determine_discount"`) {
		t.Errorf("expected decisionRef in XML, got: %s", xml)
	}
	if !strings.Contains(xml, `resultVariable="discountVar"`) {
		t.Errorf("expected resultVariable in XML, got: %s", xml)
	}
	if !strings.Contains(xml, `mapDecisionResult="singleEntry"`) {
		t.Errorf("expected mapDecisionResult in XML, got: %s", xml)
	}
}

func BenchmarkWorkflowBuilder(b *testing.B) {
	ctx := context.Background()
	wf := NewWorkflow("bench-process", "Bench Process")
	wf.StartEvent("start").
		Next("service1").
		Builder().
		ServiceTask("service1", "Service 1", "topic1").
		Wasm("./my_wasm_module.wasm").
		Next("end").
		Builder().
		EndEvent("end", "End")

	// Pre-compile to avoid compilation latency during benchmark
	_, _ = wf.WithCompilerBytes(ctx, coreWasm)
	defer wf.Close(ctx)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := wf.BuildXML(ctx)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func TestBlockClosureDSL(t *testing.T) {
	ctx := context.Background()
	wf := NewWorkflow("closure-process", "Closure Process")
	
	wf.Start("start").
		User("task1", "User Approval").
		If("${approved == true}", func(b *Branch) {
			b.Service("publish", "Publish Page", "publish-topic", func(st *ServiceTaskBuilder) {
				st.Wasm("./publish.wasm")
			}).
			End("end_approved", "Approved End")
		}).
		Else(func(b *Branch) {
			b.Service("reject", "Notify Reject", "reject-topic").
				End("end_rejected", "Rejected End")
		})

	xml, err := wf.BuildXML(ctx)
	if err != nil {
		t.Fatalf("failed to compile XML: %v", err)
	}

	if !strings.Contains(xml, `id="closure-process"`) {
		t.Errorf("expected process ID in XML, got: %s", xml)
	}
	if !strings.Contains(xml, `exclusiveGateway id="gw_task1_decision"`) {
		t.Errorf("expected exclusiveGateway decision in XML, got: %s", xml)
	}
	if !strings.Contains(xml, `serviceTask id="publish"`) {
		t.Errorf("expected serviceTask publish in XML, got: %s", xml)
	}
	if !strings.Contains(xml, `wasmPath="./publish.wasm"`) {
		t.Errorf("expected wasmPath in XML, got: %s", xml)
	}
	if !strings.Contains(xml, `serviceTask id="reject"`) {
		t.Errorf("expected serviceTask reject in XML, got: %s", xml)
	}
}


